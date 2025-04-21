// FlightBoard.js
import React, { useState, useEffect } from 'react';
import {FlightData} from '../../models/flightdata.ts';
import FlightRow from "./FlightRow.tsx";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import {getMyFlights, loadFlights, selectFlights} from './flightSlice.tsx'
import {selectLoginState} from '../Login/loginSlice.tsx' ;
import { selectUserRoleId } from '../Login/loginSlice.tsx';
import {UserRole} from '../../models/userRole.ts';
import Menu from '../Menu/menuComp.tsx';

const FlightsBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFlights);
  const roleId = useAppSelector((state) => selectLoginState(state).roleId)
  const userId = useAppSelector((state) => selectLoginState(state).userId)
  const token = useAppSelector((state) => selectLoginState(state).token)


  useEffect(() => {
    (async () => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(token);
    console.log(roleId);
    if (token && roleId === UserRole.AIRLINE){
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      
      await dispatch(getMyFlights({ token }));
    }
    })();
  }, [])
  
 
  return (
    <div>
      <Menu/>
      <h1>Flight Board</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Airline</th>
            <th>Origin Country</th>
            <th>Destination Country</th>
            <th>Departure Time</th>
            <th>Landing Time</th>
            <th>Remaining Tickets</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <FlightRow flight={flight} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightsBoard;


