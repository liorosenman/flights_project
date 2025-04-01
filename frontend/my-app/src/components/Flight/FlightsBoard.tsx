// FlightBoard.js
import React, { useState, useEffect } from 'react';
import {FlightData} from '../../models/flightdata.ts';
import FlightRow from "./FlightRow.tsx";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import {selectFlights} from './flightSlice.tsx'

const FlightsBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFlights);

  
 
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
            <th>Landing Time</th>
            <th>Departure Time</th>
            <th>Remaining Tickets</th>
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


