import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [successMessages, setSuccessMessages] = useState({});

  const fetch = async () => {
    const res = await API.get('/admin/orders');
    setOrders(res.data.orders || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusChange = (id, value) => {
    setStatusMap(prev => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (id) => {
    const status = statusMap[id];
    if (!status) return alert('Select a status first');
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      setSuccessMessages(prev => ({ ...prev, [id]: 'Updated successfully' }));
      fetch();
      setTimeout(() => {
        setSuccessMessages(prev => ({ ...prev, [id]: '' }));
      }, 2000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update');
    }
  };

const exportCSV = async () => {
  try {
    const res = await API.post(
      '/admin/orders/export',
      { selectedIds: selected },
      { responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert('Failed to export CSV');
  }
};


  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status pending';
      case 'processing': return 'status processing';
      case 'shipped': return 'status shipped';
      case 'delivered': return 'status delivered';
      case 'cancelled': return 'status cancelled';
      default: return 'status';
    }
  };

  return (
    <div className="admin-orders">
      <div className="header">
        <h3>Manage Orders</h3>
        <button className="btn-export" onClick={exportCSV}>Export Selected</button>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelected(s => [...s, o._id]);
                    else
                      setSelected(s => s.filter(x => x !== o._id));
                  }}
                />
              </td>
              <td>{o._id}</td>
              <td>{o.user?.email}</td>
              <td>₹{o.totalPrice}</td>
              <td>
                <select value={statusMap[o._id] || o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <button className="btn-update" onClick={() => updateStatus(o._id)}>Update</button>
                {successMessages[o._id] && <span className="success-msg">{successMessages[o._id]}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .admin-orders {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .header h3 {
          font-size: 22px;
          color: #1e293b;
        }

        .btn-export, .btn-update {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-export { padding: 8px 14px; }
        .btn-export:hover { background-color: #1d4ed8; }
        .btn-update { padding: 6px 10px; }
        .btn-update:hover { background-color: #1e7e34; }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(255, 192, 192, 0.35);
        }

        .orders-table th, .orders-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          vertical-align: middle;
        }

        .orders-table th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 600;
        }

        .orders-table tr:hover {
          background: #f9fafb;
        }

        select {
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
        }

        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status.pending { background-color: #fef3c7; color: #92400e; }
        .status.processing { background-color: #dbeafe; color: #1e40af; }
        .status.shipped { background-color: #e0f2fe; color: #075985; }
        .status.delivered { background-color: #dcfce7; color: #166534; }
        .status.cancelled { background-color: #fee2e2; color: #991b1b; }

        .success-msg {
          margin-left: 8px;
          color: green;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .orders-table th, .orders-table td {
            font-size: 13px;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
