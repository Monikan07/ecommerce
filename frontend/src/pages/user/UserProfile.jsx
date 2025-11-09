import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('token');
        if (!userData || !token) {
          setLoading(false);
          return;
        }
        setUser(userData);

        const res = await API.get('/orders/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to see your profile.</p>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3>My Orders</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Quantity</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.items?.reduce((sum, item) => sum + item.qty, 0)}</td>
                <td>₹{o.totalPrice}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/orders/${o._id}`}>
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      <style>{`
        .profile-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .user-info {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .orders-table th, .orders-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        .orders-table th {
          background: linear-gradient(to right, #4ba5ff, #1e3a8a);
          color: white;
          font-weight: 600;
        }

        .orders-table tr:hover {
          background: #f9fafb;
        }

        .orders-table button {
          padding: 5px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #2563eb;
          color: white;
          transition: background 0.2s;
        }

        .orders-table button:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
