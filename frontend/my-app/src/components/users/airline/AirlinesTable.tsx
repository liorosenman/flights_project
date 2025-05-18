import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchAirlines, removeAirline, setTargetAirlineId } from './airlineSlicer.tsx';
import {clearAirlineState} from './airlineSlicer.tsx'
import { selectAirlineState } from './airlineSlicer.tsx';
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
    // dispatch(clearAirlineState())
    dispatch(setTargetAirlineId(airlineId))
    try {
      await dispatch(removeAirline(airlineId)).unwrap();
      await dispatch(fetchAirlines());
    } catch (error) {
      console.error("Airline removal failed.", error);
    }
  };

  return (
    <div>
      <h1 className='heading-thin-center'>Airlines</h1>
      <table className="table table-bordered table-striped table-hover flight-table bg-white mx-auto text-center" style={{width:'90%'}}>
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
                    {error || successMsg}
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
