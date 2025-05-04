import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchAdmins, removeAdmin, selectAdminState, setTargetAdminId } from './adminsSlice.tsx';
import Menu from '../../Menu/menuComp.tsx';
import {clearAdminState} from './adminsSlice.tsx'
import { clearCustomerState } from '../customers/customersSlice.tsx';
import { clearAirlineState } from '../airline/airlineSlicer.tsx';
import { clearUsersStates } from './UserManagerComp.tsx';
import '../../../App.css'
import { selectLoginState } from '../../Login/loginSlice.tsx';

const AdminTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { admins, loading, error, successMsg, targetAdminId } = useAppSelector(selectAdminState);
  const { roleId } = useAppSelector(selectLoginState);
  const [search, setSearch] = useState('');
  

  useEffect(() => {
    clearUsersStates(dispatch);
    dispatch(fetchAdmins());
    const storedRoleId = localStorage.getItem('role_id')
    console.log("THE ROLE ID IS IS IS ",  );
    
  }, []);

  const handleRemoveAdmin = async (e: React.MouseEvent, adminId: number) => {
    e.preventDefault();
    console.log("THE ROLE ID IS " ,localStorage.getItem('role_id'));
    dispatch(clearAdminState())
    dispatch(setTargetAdminId(adminId))
    try {
      await dispatch(removeAdmin(adminId)).unwrap();
      await dispatch(fetchAdmins());
    } catch (error) {
      console.error("Admin removal failed.", error);
    }
  };

  // const filteredAdmins = admins.filter(c =>
  //   c.first_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.last_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.username.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div>
      <h2>Admins List</h2>
      <table className="table table-bordered table-striped table-hover flight-table bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Airport ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a => (
            <React.Fragment key={a.id}>
              <tr>
                <td>{a.id}</td>
                <td>{a.username}</td>
                <td>{a.first_name}</td>
                <td>{a.last_name}</td>
                <td>{a.email}</td>
                <td>{a.airport_id}</td>
                <td>{a.status ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className='remove-user-btn' onClick={(e) => handleRemoveAdmin(e, a.id)}>REMOVE</button>
                </td>
              </tr>
              {(targetAdminId === a.id) && (error || successMsg) && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
                    {error
                      ? (typeof error === 'object' && error !== null ? (error as any).message : error)
                      : (typeof successMsg === 'object' && successMsg !== null ? (successMsg as any).message : successMsg)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
