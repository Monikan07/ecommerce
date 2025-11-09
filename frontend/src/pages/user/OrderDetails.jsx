import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  const totalQuantity = order.items?.reduce((sum, i) => sum + i.qty, 0) || 0;

  const cancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await API.put(`/orders/${id}/cancel`);
      setOrder(prev => ({ ...prev, status: res.data.order.status }));
      setCancelling(false);
      alert('Order cancelled successfully');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to cancel order');
      setCancelling(false);
    }
  };

  const canCancel = !['Delivered', 'Cancelled', 'Shipped'].includes(order.status);

  return (
    <div className="order-details-page">
      <h2>Order Details</h2>
      <Link to="/profile" className="back-link">&lt; Back to Profile</Link>

      <div className="order-info">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Quantity:</strong> {totalQuantity}</p>
        <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        {canCancel && (
          <button className="btn-cancel" onClick={cancelOrder} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}

        <h3>Items Ordered</h3>
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .order-details-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 16px;
          padding: 6px 12px;
          background: #2563eb;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }

        .back-link:hover {
          background: #1d4ed8;
        }

        .order-info {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin-top: 16px;
        }

        .order-info p {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .order-info strong {
          color: #374151;
        }

        .btn-cancel {
          margin: 12px 0;
          padding: 8px 16px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s;
        }

        .btn-cancel:hover:not(:disabled) { background: #dc2626; }
        .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .products-table th, .products-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        .products-table th {
          background: linear-gradient(to right, #4ba5ff, #1e3a8a);
          color: white;
          font-weight: 600;
        }

        .products-table tr:hover { background: #f9fafb; }
      `}</style>
    </div>
  );
}
