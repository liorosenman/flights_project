import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchAdmins, removeAdmin, selectAdminState, setTargetAdminId } from './adminsSlice.tsx';
import {clearAdminState} from './adminsSlice.tsx'
import { clearUsersStates } from './UserManagerComp.tsx';
import '../../../App.css'
import { selectLoginState } from '../../Login/loginSlice.tsx';

const AdminTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { admins, loading, error, successMsg, targetAdminId } = useAppSelector(selectAdminState);

  useEffect(() => {
    clearUsersStates(dispatch);
    dispatch(fetchAdmins());
    const storedRoleId = localStorage.getItem('role_id')
  }, []);

  const handleRemoveAdmin = async (e: React.MouseEvent, adminId: number) => {
    e.preventDefault();
    dispatch(clearAdminState())
    dispatch(setTargetAdminId(adminId))
    try {
      await dispatch(removeAdmin(adminId)).unwrap();
      await dispatch(fetchAdmins());
    } catch (error) {
      console.error("Admin removal failed.", error);
    }
  };

  return (
    <div>
      <h1 className='heading-thin-center'>Admins</h1>
      <table className="table table-bordered table-striped table-hover flight-table bg-white mx-auto text-center" style={{width:'90%'}}>
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
                  <td colSpan={8} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
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
