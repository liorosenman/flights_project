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
      console.log("BBBBBBBBBBBBBBBBB");
      console.log((resultAction));
      
      
      
      // Check if login succeeded
      if (loginUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload?.token
        const decoded: any = jwtDecode(token);
        const roleId = decoded.role_id;
        console.log("AAAAAAAAAAAAAAAAAAA");
        console.log("THE ROLE ID IS ", roleId);
        
        switch (roleId) {
          case UserRole.ADMIN:
            navigate('/users');
            break;
          case UserRole.CUSTOMER:
            navigate('/flightsboard');
            break;
          case UserRole.AIRLINE:
            navigate('/createflight');
            break;
          default:
            console.log('Unknown role ID');
        }
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  

  // useEffect(() => {
  //       console.log("GGGGGGGGGGGGGGGGGGGGG");
  //       console.log(token);
        
  //       if (token != null){
  //       try{
  //       const decoded: any = jwtDecode(token);
  //       console.log(decoded);
  //       const roleId = decoded.role_id;
  //       switch (roleId) {
  //         case 1:
  //           navigate('/users');
  //           break;
  //         case 2:
  //           navigate('/createflight');
  //           break;
  //         case 3:
  //           console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  //           navigate('/createflight');
  //           break;
  //         default:
  //           console.log('Unknown user role: Staying on the login page');
  //           break;
  //       }
        
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //     }
  //   }
  // }, [token]);

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
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <Link to = "/createcustomer">Sign up form for customers</Link>
        <br></br>
        <Link to = "/createairline">Sign up form for airlines</Link>
        <br></br>
        <Link to = "/createadmin">Sign up form for admins</Link>
        <br></br>
        <Link to = "/createflight">Create flight</Link>

        {error && <p className="error-message">{error || 'Login failed'}</p>}
      </form>
    </div>
  );
};

export default LoginComp;
