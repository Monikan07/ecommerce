import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); 

  const handleView = () => {
    if (isLoggedIn) {
      navigate(`/product/${p._id}`);
    } else {
      alert("Please login to view this product"); 
      navigate("/login"); 
    }
  };

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img
          src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/400x400?text=Product"}
          alt={p.name}
          className="product-img"
        />
      </div>
      <div className="product-info">
        <h4>{p.name}</h4>
        <p>₹ {p.price?.toFixed(2)}</p>
        <button className="btn-view" onClick={handleView}>
          View Product
        </button>
      </div>

      <style>{`
        .product-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          width: 250px;
          margin: 0 auto; 
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .image-wrapper {
          width: 100%;
          height: 260px;
          overflow: hidden;
          border-bottom: 1px solid #f1f5f9;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .product-info {
          padding: 16px;
          text-align: center;
        }

        .product-info h4 {
          margin: 8px 0 4px;
          font-size: 18px;
          color: #111827;
        }

        .product-info p {
          color: #6b7280;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .btn-view {
          display: inline-block;
          background: #2563eb;
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
        }

        .btn-view:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
