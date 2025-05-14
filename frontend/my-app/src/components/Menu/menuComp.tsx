import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import './styles.css';

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedRoleId = Number(localStorage.getItem('role_id'));
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role_id');
    navigate('/login');
  };

  return (
    <div className="bg-primary-subtle py-3 px-4 border-bottom shadow-sm">
      <nav className="d-flex justify-content-between align-items-center">
        <div>
          {storedRoleId === 3 && (
            <>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/flightsboard">My Flights</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/createflight">Create flight</Link>
            </>
          )}
          {storedRoleId === 2 && (
            <>
              <Link className="me-3 text-dark  text-decoration-none fw-semibold menu-hover-effect" to="/flightsboard ">Flights Board</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/ticketslist">My Tickets</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/updatecustomer">Details</Link>
            </>
          )}
          {storedRoleId === 1 && (
            <>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/users/2">Customers</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/users/1">Admins</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/users/3">Airlines</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/createairline">+Airline</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/createadmin">+Admin</Link>
              {/* <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/createairline">Airline register</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/createadmin">Customer register</Link> */}
            </>
          )}
        </div>
        {storedRoleId !== null && (
          <button
            className="btn btn-outline-danger btn-lg"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}
      </nav>
    </div>
  );
};

export default Menu;
