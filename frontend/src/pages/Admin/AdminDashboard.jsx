import React, { useEffect, useState } from 'react';
import API from '../../api';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/admin/orders'),
          API.get('/admin/products'),
        ]);

        const allOrders = ordersRes.data.orders || ordersRes.data || [];
        const totalRevenue = allOrders
          .filter(o => o.status.toLowerCase() === 'delivered')
          // .filter(o => ['delivered', 'cancelled'].includes(o.status.toLowerCase()))
          .reduce((sum, o) => sum + o.totalPrice, 0);

        setOrders(allOrders);
        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter(o => o.status === 'Processing').length,
          totalProducts: productsRes.data.total || 0,
          totalRevenue,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = e => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = filters.search
      ? o._id.includes(filters.search)
      : true;
    const matchesStatus = filters.status ? o.status === filters.status : true;
    const matchesStart = filters.startDate
      ? new Date(o.createdAt) >= new Date(filters.startDate)
      : true;
    const matchesEnd = filters.endDate
      ? new Date(o.createdAt) <= new Date(filters.endDate)
      : true;
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  const openModal = (type, data) => setModal({ show: true, type, data });
  const closeModal = () => setModal({ show: false, type: '', data: null });

  const confirmAction = async () => {
    if (!modal.data) return;
    try {
      if (modal.type === 'delete') {
        await API.delete(`/orders/${modal.data._id}`);
        setOrders(prev => prev.filter(o => o._id !== modal.data._id));
        alert('Order deleted successfully');
      } else if (modal.type === 'updateStatus') {
        const res = await API.put(`/orders/${modal.data._id}/status`, {
          status: modal.data.newStatus,
        });
        setOrders(prev =>
          prev.map(o =>
            o._id === modal.data._id ? { ...o, status: res.data.order.status } : o
          )
        );
        alert('Order status updated successfully');
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${tab === 'products' ? 'active' : ''}`}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="dashboard-content">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="kpi">
                <div className="card">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
                <div className="card">
                  <h3>{stats.pendingOrders}</h3>
                  <p>Pending Orders</p>
                </div>
                <div className="card">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
                <div className="card">
                  <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>

              <div className="filters">
                <input
                  type="text"
                  name="search"
                  placeholder="Search by Order ID"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>

              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Total Qty</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user?.name || order.user?.email}</td>
                      <td>{order.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal('updateStatus', { ...order, newStatus: 'Delivered' })
                          }
                        >
                          Mark Delivered
                        </button>
                        <button onClick={() => openModal('delete', order)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {tab === 'products' && <AdminProducts />}
      {tab === 'orders' && <AdminOrders />}

      {modal.show && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>
              Are you sure you want to{' '}
              {modal.type === 'delete' ? 'delete this order' : 'change its status'}?
            </p>
            <div className="modal-actions">
              <button onClick={confirmAction}>Yes</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-title { font-size: 28px; margin-bottom: 20px; color: #1e293b; }
        .tabs { display: flex; gap: 12px; margin-bottom: 20px; }
        .tab-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 8px; cursor: pointer; color: #334155; font-weight: 500; transition: all 0.2s ease; }
        .tab-btn:hover { background-color: #f1f5f9; }
        .tab-btn.active { background-color: #2563eb; color: white; border-color: #2563eb; }

        .kpi { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .kpi .card { flex:1; background:white; border-radius:12px; padding:24px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.05); min-width:200px; transition:0.2s; }
        .kpi .card:hover { transform:translateY(-3px); box-shadow:0 6px 20px rgba(0,0,0,0.08); }
        .kpi h3 { font-size:28px; color:#2563eb; margin:0; }
        .kpi p { color:#475569; margin-top:6px; font-size:15px; }

        .filters { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
        .filters input, .filters select { padding:6px 10px; border-radius:6px; border:1px solid #ccc; }

        .orders-table { width:100%; border-collapse:collapse; margin-top:12px; }
        .orders-table th, .orders-table td { padding:12px; border-bottom:1px solid #e2e8f0; text-align:center; }
        .orders-table th { background:#4ba5ff; color:white; }
        .orders-table button { margin-right:6px; padding:5px 10px; border:none; border-radius:6px; cursor:pointer; background:#2563eb; color:white; }
        .orders-table button:hover { background:#1d4ed8; }

        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; }
        .modal { background:white; padding:24px; border-radius:10px; max-width:400px; width:100%; text-align:center; }
        .modal-actions button { margin:8px; padding:8px 16px; border-radius:6px; border:none; cursor:pointer; }
        .modal-actions button:first-child { background:#ef4444; color:white; }
        .modal-actions button:last-child { background:#ccc; }
      `}</style>
    </div>
  );
}
