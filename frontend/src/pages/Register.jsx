import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>Register</button>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>

      <style>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f9fafb, #e0e7ff);
        }

        .register-box {
          background: #ffffff;
          padding: 36px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
        }

        .register-box h2 {
          text-align: center;
          color: #1e293b;
          margin-bottom: 24px;
          font-size: 24px;
        }

        .register-box label {
          margin-bottom: 6px;
          color: #374151;
          font-weight: 500;
        }

        .register-box input {
          margin-bottom: 16px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .register-box input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
        }

        .register-box button {
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

        .register-box button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .login-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #475569;
        }

        .login-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .register-box {
            padding: 26px 20px;
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
