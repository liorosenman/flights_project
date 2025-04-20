// FlightBoard.js
import React, { useState, useEffect } from 'react';
import {FlightData} from '../../models/flightdata.ts';
import FlightRow from "./FlightRow.tsx";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import {loadFlights, selectFlights} from './flightSlice.tsx'
import {selectLoginState} from '../Login/loginSlice.tsx' ;
import { selectUserRoleId } from '../Login/loginSlice.tsx';
import {getMyFlights} from '../airline/airlineSlicer.tsx';

const FlightsBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFlights);
  const roleId = useAppSelector(selectUserRoleId);

  // console.table(flights);

  
  useEffect(() => {
    
    // dispatch(loadFlights());
    // console.table(flights)

  }, [])
  
 
  return (
    <div>
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


