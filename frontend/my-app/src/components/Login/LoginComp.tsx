import React, { useEffect, useState } from 'react';
import { loginUser, selectLoginState } from './loginSlice.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { jwtDecode } from 'jwt-decode';
import './styles.css';
import { UserRole } from '../../models/UserRole.ts';
import { clearError } from './loginSlice.tsx';

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
      if (loginUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload?.token;
        const decoded = jwtDecode<{ role_id: number; username: string }>(token);
        const { role_id: roleId, username: decodedUsername } = decoded;

        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', resultAction.payload.refresh);
        localStorage.setItem('role_id', String(roleId));
        localStorage.setItem('username', decodedUsername);

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

  useEffect(() => {
    dispatch(clearError())
  }, [])
  

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

          {/* Button group with spacing */}
          <div className="d-flex flex-column gap-3 mt-3">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={() => navigate('/flightsboard')} className="btn btn-dark w-100">
              Flights board
            </button>
          </div>

          {/* Links */}
          <div className="mt-4">
            <Link to="/createcustomer">Register as customer</Link>
            <br />
          </div>

          {/* Error */}
          {error && <p className="error-message mt-3">{error || 'Login failed'}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginComp;
