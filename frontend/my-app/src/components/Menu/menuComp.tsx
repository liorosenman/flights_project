import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { logout, selectLoginState } from '../Login/loginSlice.tsx';
import { Outlet } from 'react-router-dom';

const Menu = () => {

  const navigate = useNavigate();
  const { token, refreshToken } = useAppSelector(selectLoginState);

  const dispatch = useAppDispatch();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(logout());
    const currentToken = localStorage.getItem('access_token');
    console.log('token in Redux:', token);
    console.log('token in localStorage:', currentToken);
    console.log(token);
    
    navigate('/login');
  };

  return (
    <div>
        <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        <Link to="/createcustomer">Board</Link>| {" "}
        <Link to="/createflight">Flight</Link>|{" "}
        {/* <a href="/login" onClick={handleLogout}>LogOut</a> |{" "} */}
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
          LogOut
        </button>
      </nav>
      <Outlet />
    </div>
  )
}

export default Menu
