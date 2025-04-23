// Flight.js
import React from 'react';
import {selectLoginState} from '../Login/loginSlice.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addTicket, loadFlights, selectFlightsState } from './flightSlice.tsx';
import { FlightState } from './flightSlice.tsx';

const FlightRow = ({ flight })   => {
  const dispatch = useAppDispatch();
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const { error, successMsg, loading } = useAppSelector(selectFlightsState);
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const handlePurchase = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    console.log(flightId);
    await dispatch(addTicket({ flight_id: flightId }));
    try {
      await dispatch(addTicket({ flight_id: flightId })).unwrap();
      await dispatch(loadFlights());
    } catch (error) {
      console.error("Ticket purchase failed:", error);
    }
  }
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
