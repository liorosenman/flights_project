import React, { useState } from 'react'
import { useAppSelector } from '../../../app/hooks.ts';
import CustomerTable from '../customers/CustomerTable.tsx';
import AdminTable from './AdminsTable.tsx';
import AirlinesTable from '../airline/AirlinesTable.tsx';
import { Link, useParams } from 'react-router-dom';
import { UserRole } from '../../../models/UserRole.ts';
import customersSlice, { clearCustomerState, fetchCustomers, getCustomerByUsername, selectCustomerState } from '../customers/customersSlice.tsx';
import { clearAdminState, fetchAdmins, selectAdminState } from './adminsSlice.tsx';
import { clearAirlineState, fetchAirlines, getAirlineByUsername, selectAirlineState } from '../airline/airlineSlicer.tsx';
import { useAppDispatch } from '../../../app/hooks.ts'
import { AppDispatch } from '../../../app/store.ts';
import { getAdminByUsername } from '../admins/adminsSlice.tsx';
import './managingUsersStyle.css';


export const clearUsersStates = (dispatch: AppDispatch) => {
  dispatch(clearAirlineState());
  dispatch(clearAdminState());
  dispatch(clearCustomerState());
};

const UserManagerComp: React.FC = () => {

  const [searchUsername, setSearchUsername] = useState('');
  const { roleId } = useParams();
  const role = Number(roleId);
  const dispatch = useAppDispatch();
  const adminError = useAppSelector((state) => selectAdminState(state).filterError)
  const customerError = useAppSelector((state) => selectCustomerState(state).filterError);
  const airlineError = useAppSelector((state) => selectAirlineState(state).filterError);
  const displayedError = adminError || customerError || airlineError;

  const handleShowAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    clearUsersStates(dispatch);
    switch (role) {
      case UserRole.ADMIN:
        await dispatch(fetchAdmins());
        break;
      case UserRole.CUSTOMER:
        await dispatch(fetchCustomers());
      case UserRole.AIRLINE:
        await dispatch(fetchAirlines())
        break;
      default:
        console.error('Unrecognized user role:', role);
    }
  }

  const handleSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    clearUsersStates(dispatch);
    switch (role) {
      case UserRole.ADMIN:
        await dispatch(getAdminByUsername(searchUsername));
        break;
      case UserRole.CUSTOMER:
        await dispatch(getCustomerByUsername(searchUsername));
        break;
      case UserRole.AIRLINE:
        await dispatch(getAirlineByUsername(searchUsername));
        break;
      default:
        console.error('Unrecognized user role:', role);
    }
  };


  return (
    <div>
      <div className="user-manager-controls">
        <button onClick={handleShowAll} className="user-manager-button">
          Show All
        </button>
        <input
          type="text"
          placeholder="Enter username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="user-manager-input"
        />
        <button onClick={handleSearch} className="user-manager-button">
          Search
        </button>
      </div>
      {displayedError && (
        <div className="user-manager-error">
          <h3>{displayedError}</h3>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {role === UserRole.ADMIN && <AdminTable />}
        {role === UserRole.CUSTOMER && <CustomerTable />}
        {role === UserRole.AIRLINE && <AirlinesTable />}
      </div>
    </div>
  )
}

export default UserManagerComp
