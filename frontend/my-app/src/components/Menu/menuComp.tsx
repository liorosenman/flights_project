import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import './styles.css';

const Menu = () => {
  const navigate = useNavigate();
  const { roleId } = useAppSelector(selectLoginState);
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="bg-primary-subtle py-3 px-4 border-bottom shadow-sm">
      <nav className="d-flex justify-content-between align-items-center">
        <div>
          {roleId === 3 && (
            <>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/createflight">My Flights</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/flightsboard">Board</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/createflight">Create flight</Link>
            </>
          )}
          {roleId === 2 && (
            <>
              <Link className="me-3 text-dark  text-decoration-none fw-semibold" to="/flightsboard">Flights Board</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold menu-hover-effect" to="/ticketslist">My Tickets</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/updatecustomer">Details</Link>
            </>
          )}
          {roleId === 1 && (
            <>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/customerslist">Customers</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/adminslist">Admins</Link>
              <Link className="me-3 text-dark text-decoration-none fw-semibold" to="/airlineslist">Airlines</Link>
            </>
          )}
        </div>
        <button
          className="btn btn-outline-danger btn-lg"
          onClick={handleLogout}
        >
          Log out
        </button>
      </nav>
    </div>
  );
};

export default Menu;
