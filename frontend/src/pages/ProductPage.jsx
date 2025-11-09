import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setP(res.data))
      .catch(console.error);
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.product === p._id);
    if (existing) existing.qty += qty;
    else cart.push({ product: p._id, name: p.name, price: p.price, qty });
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (!p) return <div className="loading">Loading...</div>;

  return (
    <div className="product-page">
      <div className="product-card">
        <img
  src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/400x300?text=Product"}
          alt={p.name}
          className="product-image"
        />
        <div className="product-info">
          <h2>{p.name}</h2>
          <p className="description">{p.description}</p>
          <p className="price">₹ {p.price}</p>

          <div className="qty-section">
            <label>
              Qty:
              <input
                type="number"
                value={qty}
                min="1"
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </label>
          </div>

          <button className="add-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <style>{`
        .product-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background: linear-gradient(135deg, #f8fafc, #e0e7ff);
          padding: 20px;
        }

        .product-card {
          display: flex;
          flex-direction: row;
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          max-width: 900px;
          width: 100%;
          gap: 24px;
        }

        .product-image {
          width: 50%;
          height: auto;
          border-radius: 10px;
          object-fit: cover;
          background: #f1f5f9;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .product-info h2 {
          font-size: 24px;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .description {
          color: #475569;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .price {
          font-size: 20px;
          color: #2563eb;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .qty-section label {
          font-weight: 500;
          color: #334155;
        }

        .qty-section input {
          width: 60px;
          margin-left: 8px;
          padding: 6px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .qty-section input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
        }

        .add-btn {
          margin-top: 18px;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          width: fit-content;
          transition: background 0.25s, transform 0.1s;
        }

        .add-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .loading {
          text-align: center;
          font-size: 18px;
          padding: 40px;
          color: #475569;
        }

        @media (max-width: 768px) {
          .product-card {
            flex-direction: column;
            align-items: center;
          }

          .product-image {
            width: 100%;
            max-height: 300px;
          }

          .product-info {
            text-align: center;
          }

          .add-btn {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
}
