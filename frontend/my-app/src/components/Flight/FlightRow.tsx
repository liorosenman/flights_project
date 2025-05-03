// Flight.js
import React, { useState } from 'react';
import { selectLoginState } from '../Login/loginSlice.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addTicket, getMyFlights, loadFlights, removeFlight, selectFlightsState, updateFlight } from './flightSlice.tsx';
import { FlightState } from './flightSlice.tsx';
import { formatDateTime } from '../../utils/DateTimeFormat.ts';
import { setTargetFlightId, setToBeUpdFlightId, clearFlightState } from './flightSlice.tsx'
import { FlightData } from '../../models/flightdata.ts';
import { LinkedFlightData } from '../../models/LinkedFlightData.ts';

interface FlightRowProps {
  flight: LinkedFlightData;   
  onRefilter: () => Promise<void>; 
}


const FlightRow: React.FC<FlightRowProps> = ({ flight, onRefilter }) => {
  // const [error, setError] = useState<string | null>(null);
  // const [targetFlightId, setTargetFlightId] = useState<number | null>(null);
  // const [successMsg, setSuccessMsg, ]
  const [updDate, setupdDate] = useState('')
  const dispatch = useAppDispatch();
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const { loading } = useAppSelector(selectFlightsState);
  const { targetFlightId, error, successMsg, toBeUpdatedFlight } = useAppSelector(selectFlightsState);
  


  const handlePurchase = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    try {
      await dispatch(addTicket({ flight_id: flightId })).unwrap();
      await onRefilter(); 

    } catch (error) {
      console.error("Ticket purchase failed:", error);
    }
  };

  const handleRemoval = async (e: React.MouseEvent, flightId: number) => {
    e.preventDefault();
    dispatch(clearFlightState())
    try {
      await dispatch(removeFlight({ flight_id: flightId })).unwrap();
      await onRefilter();
      // await dispatch(getMyFlights({ token }));
      // dispatch(setTargetFlightId(null))
    } catch (error) {
      console.error("Flight removal failed.", error);
    }
  };

  const openUpdCalendar = (e: React.MouseEvent, flightId: number) => {
    dispatch(clearFlightState());
    console.log("THE SUCCESS IS ", successMsg);
    console.log("THE ERROR IS ", error);
    dispatch(setToBeUpdFlightId(flightId))
    console.log("THE UPD FLIGHT IS ", flightId);

  }

  const handleUpdateFlight = async (e: React.MouseEvent<HTMLButtonElement>, flightId: number) => {
    e.preventDefault();
    if (!updDate) {
      alert('Please select a date and time.');
      return;
    }
    console.log("BBBBBBBBBBBBBBBB");
    try {
      await dispatch(updateFlight({ flightId, newDepTime: updDate })).unwrap();
      setupdDate(''); // clear after update
    } catch (error) {
      console.error("Flight update failed.")
    }
    // dispatch(setToBeUpdFlightId(null))
    await dispatch(getMyFlights({ token }));
  };


  return (
    <>
      <tr>
        <td>{flight.flight_id}</td>
        <td>{flight.airline_name}</td>
        <td>{flight.origin_country_name}</td>
        <td>{flight.destination_country_name}</td>
        <td>{formatDateTime(flight.departure_time)}</td>
        <td>{formatDateTime(flight.landing_time)}</td>
        <td>{flight.remaining_tickets}</td>
        <td>{flight.status}</td>

        {roleId === 2 && flight.status === 'active' && (
          <td>
            <button className="buy-ticket-btn" onClick={(e) => handlePurchase(e, flight.flight_id)}>
              Buy ticket
            </button>
          </td>
        )}

        {roleId === 3 && flight.status === 'active' && (
          <>
            <td>
              <button onClick={(e) => handleRemoval(e, flight.flight_id)}>
                Deactivate
              </button>
            
            
              <button onClick={(e) => openUpdCalendar(e, flight.flight_id)}>
                +
              </button>
            </td>
          </>
        )}
      </tr>

      {toBeUpdatedFlight === flight.flight_id && (
  <tr>
    <td colSpan={9} style={{ textAlign: 'center' }}>
      <input
        type="datetime-local"
        value={updDate}
        onChange={(e) => setupdDate(e.target.value)}
        style={{ marginRight: '10px' }}
        required
      />
      <button onClick={(e) => handleUpdateFlight(e, flight.flight_id)}>Update</button>
    </td>
  </tr>
)}

{(targetFlightId === flight.flight_id || toBeUpdatedFlight === flight.flight_id) && (error || successMsg) && (
  <tr>
   <td colSpan={9} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
  {error
    ? (typeof error === 'object' && error !== null ? (error as any).message : error)
    : (typeof successMsg === 'object' && successMsg !== null ? (successMsg as any).message : successMsg)}
</td>
  </tr>
)}

    </>
  );

};

export default FlightRow
