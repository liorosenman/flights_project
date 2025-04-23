import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import loginSlice, { logout, selectLoginState}from '../Login/loginSlice.tsx';
import { Outlet } from 'react-router-dom';
import { clearAuthTokens } from '../Login/loginSlice.tsx';

const Menu = () => {

  const navigate = useNavigate();
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);

  const dispatch = useAppDispatch();

  const handleLogout =  () => {
    // e.preventDefault();
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEE");
    console.log('the roleid is ', roleId);
    
    // await dispatch(logout());
    // dispatch(clearAuthTokens());
    const currentToken = localStorage.getItem('access_token');
    console.log('token in Redux:', token);
    console.log('token in localStorage:', currentToken);
    console.log(token);
    
    navigate('/login');
  };

  // if (roleId === null || roleId === undefined) {
  //   return <p>Loading menu...</p>; // Or return nothing until roleId is available
  // }

  return (
    <div>
        <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        {roleId === 3 && (
          <>
        <Link to="/createcustomer">CustomerSignUp</Link>| {" "}
        <Link to="/createflight">Flight</Link>|{" "}
        <Link to="/flightsboard">Board</Link>|{" "}
        </>
        )}
        {roleId === 2 && (
          <>
        <Link to="/flightsboard">Board</Link>|{" "}
          </>
        )}
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
          LogOut1
        </button>
      </nav>
      <Outlet />
    </div>
  )
}

export default Menu
