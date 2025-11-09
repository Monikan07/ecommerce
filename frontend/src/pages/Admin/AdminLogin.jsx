import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@12345');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post('/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
        />

        <button onClick={login}>Login</button>
      </div>

      {/* Embedded CSS */}
      <style>{`
        .admin-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f1f5f9, #dbeafe);
        }

        .admin-login-box {
          background-color: #ffffff;
          padding: 36px 30px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
        }

        .admin-login-box h2 {
          text-align: center;
          color: #1e293b;
          margin-bottom: 24px;
          font-size: 24px;
          letter-spacing: 0.5px;
        }

        .admin-login-box label {
          color: #334155;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .admin-login-box input {
          margin-bottom: 16px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .admin-login-box input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
        }

        .admin-login-box button {
          background-color: #2563eb;
          color: #fff;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          margin-top: 10px;
          transition: background 0.25s, transform 0.1s;
        }

        .admin-login-box button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .admin-login-box {
            padding: 26px 20px;
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
