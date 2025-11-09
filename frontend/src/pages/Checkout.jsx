import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  const handlePlace = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Login first'); return; }
      const items = cart.map(c => ({ product: c.product, qty: c.qty }));
      const res = await API.post('/orders', { items, shippingAddress: address });
      localStorage.removeItem('cart');
      alert('Order placed: ' + res.data._id);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <label>
          Address
          <input value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} />
        </label>
        <label>
          City
          <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        </label>
        <label>
          Postal Code
          <input value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
        </label>
        <label>
          Country
          <input value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
        </label>
        <button className="btn-place" onClick={handlePlace}>Place Order</button>
      </div>

      <style>{`
        .checkout-page {
          max-width: 500px;
          margin: 40px auto;
          padding: 24px;
          background: #84c1ffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #111827;
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 500;
          margin-bottom: 12px;
          color: #374151;
          display: flex;
          flex-direction: column;
        }

        input {
          padding: 10px 12px;
          margin-top: 6px;
          border: 1px solid #b3d1ffff;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }

        input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .btn-place {
          margin-top: 16px;
          padding: 12px 0;
          background: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-place:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
