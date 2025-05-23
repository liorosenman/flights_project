import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import './styles.css';
import { clearFlightState } from '../Flight/flightSlice.tsx';
import { clearTicketsState } from '../ticket/ticketSlicer.tsx';
import { clearAdminState } from '../users/admins/adminsSlice.tsx';
import { clearAirlineState } from '../users/airline/airlineSlicer.tsx';
import { clearCustomerState } from '../users/customers/customersSlice.tsx';

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedRoleIdRaw = localStorage.getItem('role_id');
  const storedRoleId = storedRoleIdRaw !== null ? Number(storedRoleIdRaw) : null;

  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role_id');
    localStorage.removeItem('username');
    dispatch(clearFlightState());
    dispatch(clearTicketsState());
    dispatch(clearAdminState());
    dispatch(clearAirlineState());
    dispatch(clearCustomerState());
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
        {storedRoleId !== null ? (
          <button
            className="btn btn-outline-danger btn-lg"
            onClick={handleLogout}
          >
            Log out
          </button>
        ) : (<button className="btn btn-outline-secondary btn-lg"
                     onClick={() => navigate('/login')}
            >Back</button>)}
      </nav>
    </div>
  );
};

export default Menu;
