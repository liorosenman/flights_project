// Flight.js
import React from 'react';
import {selectLoginState} from '../Login/loginSlice.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addTicket, loadFlights, selectFlightsState } from './flightSlice.tsx';
import { FlightState } from './flightSlice.tsx';
import {formatDateTime} from '../../utils/DateTimeFormat.ts';

const FlightRow = ({ flight })   => {
  const dispatch = useAppDispatch();
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const { error, successMsg, loading } = useAppSelector(selectFlightsState);

  const handlePurchase = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    try {
      await dispatch(addTicket({ flight_id: flightId })).unwrap();
      await dispatch(loadFlights());
    } catch (error) {
      console.error("Ticket purchase failed:", error);
    }
  };
  

  return (
    <tr>
      <td>{flight.flight_id}</td>
      <td>{flight.airline_name}</td>
      <td>{flight.origin_country_name}</td>
      <td>{flight.destination_country_name}</td>
      <td>{formatDateTime(flight.departure_time)}</td>
      <td>{formatDateTime(flight.landing_time)}</td>
      <td>{flight.remaining_tickets}</td>
      <td>{flight.status}</td>
      {flight.status === 'active' &&
        <td><button onClick={(e) => handlePurchase(e, flight.flight_id)}>Buy ticket</button></td>}
    </tr>
  );
};

export default FlightRow
