import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty -= 1;
    if (updated[index].qty <= 0) updated.splice(index, 1);
    updateCart(updated);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const checkout = () => navigate('/checkout');

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Shopping Cart</h2>

        <div className="cart-card">
          {cart.length === 0 ? (
            <p className="empty">Your cart is empty.</p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, i) => (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td>
                        <div className="qty-controls">
                          <button onClick={() => decreaseQty(i)}>-</button>
                          <span>{c.qty}</span>
                          <button onClick={() => increaseQty(i)}>+</button>
                        </div>
                      </td>
                      <td>₹{(c.price * c.qty).toFixed(2)}</td>
                      <td>
                        <button className="btn-remove" onClick={() => removeItem(i)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="total-section">
                <p>
                  <strong>Total:</strong> ₹ {total.toFixed(2)}
                </p>
                <button className="checkout-btn" onClick={checkout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .cart-page {
          position: relative;
          min-height: 90vh;
          display: flex;
          justify-content: flex-start; /* align left */
          align-items: flex-start;
          padding: 40px 20px;
          background-image: url('https://static.vecteezy.com/system/resources/previews/002/045/367/non_2x/paper-boxes-in-a-trolley-on-a-blue-background-online-shopping-or-e-commerce-concept-and-delivery-service-concept-with-copy-space-for-your-design-free-photo.jpg');
          background-size: cover;
          background-position: center;
        }

        /* Dark overlay for low brightness */
        .cart-page::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4); /* adjust darkness */
          z-index: 0;
        }

        .cart-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 50%; /* take half of the screen */
          max-width: 750px;
          margin-left: 40px;
        }

        .cart-container h2 {
          color: #fff;
          margin-bottom: 24px;
          font-size: 26px;
        }

        .cart-card {
          background: rgba(255, 255, 255, 0.9);
          width: 100%;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          position: relative;
        }

        .empty {
          text-align: center;
          color: #475569;
          font-size: 16px;
        }

        .cart-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }

        .cart-table th, .cart-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          font-size: 15px;
        }

        .cart-table th {
          background-color: #f1f5f9;
          color: #334155;
          font-weight: 600;
        }

        .cart-table tr:hover {
          background-color: #f9fafb;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qty-controls button {
          background-color: #2563eb;
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: background 0.2s, transform 0.1s;
        }

        .qty-controls button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .qty-controls span {
          font-weight: 500;
          color: #1e293b;
          min-width: 20px;
          text-align: center;
        }

        .btn-remove {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.25s, transform 0.1s;
        }

        .btn-remove:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .total-section p {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .checkout-btn {
          background-color: #2563eb;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background 0.25s, transform 0.1s;
        }

        .checkout-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .cart-container {
            width: 70%;
          }
        }

        @media (max-width: 768px) {
          .cart-page {
            justify-content: center; /* center on mobile */
          }
          .cart-container {
            width: 90%;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
