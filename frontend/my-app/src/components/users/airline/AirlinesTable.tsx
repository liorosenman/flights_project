import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchAirlines, removeAirline, setTargetAirlineId } from './airlineSlicer.tsx';
import Menu from '../../Menu/menuComp.tsx';
import {clearAirlineState} from './airlineSlicer.tsx'
import { selectAirlineState } from './airlineSlicer.tsx';
import { clearCustomerState } from '../customers/customersSlice.tsx';
import { clearAdminState } from '../admins/adminsSlice.tsx';
import { clearUsersStates } from '../admins/UserManagerComp.tsx';
import '../../../App.css'

const AirlinesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { airlines, loading, error, successMsg, targetAirlineId } = useAppSelector(selectAirlineState);
  const [search, setSearch] = useState('');
  

  useEffect(() => {
    clearUsersStates(dispatch);
    dispatch(fetchAirlines());
  }, []);

  const handleRemoveAirline = async (e: React.MouseEvent, airlineId: number) => {
    e.preventDefault();
    dispatch(clearAirlineState())
    dispatch(setTargetAirlineId(airlineId))
    try {
      await dispatch(removeAirline(airlineId)).unwrap();
    } catch (error) {
      console.error("Airline removal failed.", error);
    }
  };

  // const filteredAdmins = airlines.filter(c =>
  //   c.first_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.last_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.username.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div>
      <h2>Airlines List</h2>
      <table className="table table-bordered table-striped table-hover flight-table bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>|Name</th>
            <th>Country</th>
            <th>Email</th>
            <th>Airport ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {airlines.map(a => (
            <React.Fragment key={a.id}>
              <tr>
                <td>{a.id}</td>
                <td>{a.username}</td>
                <td>{a.name}</td>
                <td>{a.country}</td>
                <td>{a.email}</td>
                <td>{a.airport_id}</td>
                <td>{a.status ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className='remove-user-btn' onClick={(e) => handleRemoveAirline(e, a.id)}>REMOVE</button>
                </td>
              </tr>
              {(targetAirlineId === a.id) && (error || successMsg) && (
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

export default AirlinesTable;
