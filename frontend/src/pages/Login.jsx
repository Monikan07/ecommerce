import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    setError('');

    try {
      const res = await API.post('/auth/login', {
        email,
        password,
      });

      // Save token and user info to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/'); // Redirect to homepage
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Customer Login</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
        <p>
  Don't have an account?{' '}
  <span
    style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
    onClick={() => navigate('/register')}
  >
    Signup
  </span>
</p>

      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #e0e7ff, #f9fafb);
        }

        .login-box {
          background: #ffffff;
          padding: 32px 28px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
        }

        .login-box h2 {
          text-align: center;
          color: #1e293b;
          margin-bottom: 24px;
        }

        .login-box label {
          margin-bottom: 6px;
          color: #374151;
          font-weight: 500;
        }

        .login-box input {
          margin-bottom: 18px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-box input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.4);
        }

        .login-box button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background 0.25s, transform 0.1s;
        }

        .login-box button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 24px 20px;
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
