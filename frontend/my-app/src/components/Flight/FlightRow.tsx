// Flight.js
import React, { useState } from 'react';
import {selectLoginState} from '../Login/loginSlice.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addTicket, getMyFlights, loadFlights, removeFlight, selectFlightsState } from './flightSlice.tsx';
import { FlightState } from './flightSlice.tsx';
import {formatDateTime} from '../../utils/DateTimeFormat.ts';

const FlightRow = ({ flight })   => {
  // const [error, setError] = useState<string | null>(null);
  // const [targetFlightId, setTargetFlightId] = useState<number | null>(null);
  // const [successMsg, setSuccessMsg, ]
  const dispatch = useAppDispatch();
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const { loading } = useAppSelector(selectFlightsState);

  const handlePurchase = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    try {
      await dispatch(addTicket({ flight_id: flightId })).unwrap();
      await dispatch(loadFlights());
    } catch (error) {
      console.error("Ticket purchase failed:", error);
    }
  };

  const handleRemoval = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    try {
      await dispatch(removeFlight(flightId)).unwrap();
      await dispatch(getMyFlights({token}));
    } catch (error) {
      console.error("Ticket removal failed.", error);
    }
  };



  return (
    <div>
    <tr>
      <td>{flight.flight_id}</td>
      <td>{flight.airline_name}</td>
      <td>{flight.origin_country_name}</td>
      <td>{flight.destination_country_name}</td>
      <td>{formatDateTime(flight.departure_time)}</td>
      <td>{formatDateTime(flight.landing_time)}</td>
      <td>{flight.remaining_tickets}</td>
      <td>{flight.status}</td>
      {roleId === 2 && flight.status === 'active' &&  
        <td><button onClick={(e) => handlePurchase(e, flight.flight_id)}>Buy ticket</button></td>}
      {roleId === 3 && flight.status === 'active' &&
        <td><button onClick={(e) => handleRemoval(e, flight.flight_id)}>
        {loading ? 'Processing' : 'Cancel'}
        </button></td>}
    </tr>
     </div>
  )
};

export default FlightRow
