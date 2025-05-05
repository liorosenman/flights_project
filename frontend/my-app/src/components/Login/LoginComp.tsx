import React, { useEffect, useState } from 'react';
import { loginUser, selectLoginState } from './loginSlice.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { jwtDecode } from 'jwt-decode';
import './styles.css';
import { UserRole } from '../../models/userRole.ts';

const LoginComp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, error, loading } = useAppSelector(selectLoginState);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ username, password }));
      // Check if login succeeded
      if (loginUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload?.token
        const decoded = jwtDecode<{ role_id: number }>(token);
        const logged_username = jwtDecode<{ username: string }>(token);
        const roleId = decoded.role_id;
        const username = logged_username.username;
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', resultAction.payload.refresh);
        localStorage.setItem('role_id', String(roleId));
        localStorage.setItem('username', username);
        
        switch (roleId) {
          case UserRole.ADMIN:
            navigate('/users/1');
            break;
          case UserRole.CUSTOMER:
            navigate('/flightsboard');
            break;
          case UserRole.AIRLINE:
            navigate('/createflight');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
<div className="fullscreen-center-container">
  <div className="login-form-box">
    <h2 className="text-xl font-semibold mb-4">Login</h2>
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        className="input-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <Link to="/createcustomer">Sign up form for customers</Link>
      <br />
      <Link to="/createairline">Sign up form for airlines</Link>
      <br />
      <Link to="/createadmin">Sign up form for admins</Link>
      <br />
      <Link to="/createflight">Create flight</Link>
      <br />
      <Link to="/customerslist">Customers Table</Link>

      {error && <p className="error-message">{error || 'Login failed'}</p>}
    </form>
  </div>
</div>
  );
};

export default LoginComp;
