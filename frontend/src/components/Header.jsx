import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';
  const isCustomer = user && !isAdmin;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><strong>MyShop</strong></Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>

        {isCustomer && (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/products">Products</Link>
            <Link to="/login">Login</Link>
            <Link to="/admin/login">Admin</Link>
          </>
        )}

        {user && (
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        )}
      </nav>

      <style>{`
        .header {
          background: #1e3a8a;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .logo a {
          text-decoration: none;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #fcd34d, #a5f3fc, #fbcfe8, #fde68a);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 6s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-links a {
          color: #dbeafe;
          text-decoration: none;
          font-weight: 600;
          font-size: 17px;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: #ffffff;
        }

        .btn-logout {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-logout:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .nav-links {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </header>
  );
}
