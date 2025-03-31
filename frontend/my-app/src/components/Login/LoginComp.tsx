import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './loginSlice.tsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { RootState } from '../../app/store.ts';
// import { AppDispatch, RootState } from '../../app/store'
import './styles.css';

const LoginComp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
 
  // const navigate = useNavigate();
  const { token, error, loading } = useAppSelector((state: RootState) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ username, password }));
    
  };

  useEffect(() => {
    if (token) {
      console.log("Login successful");
      // navigate('/dashboard'); 
    }
  }, [token]);

  return (
    <div className="container">
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
        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error || 'Login failed'}</p>}
      </form>
    </div>
  );
};

export default LoginComp;
