// Flight.js
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addTicket, clearFlights, getMyFlights, loadFlights, removeFlight, selectFlightsState, updateFlight } from './flightSlice.tsx';
import { formatDateTime } from '../../utils/DateTimeFormat.ts';
import { setToBeUpdFlightId, clearFlightState } from './flightSlice.tsx'
import { LinkedFlightData } from '../../models/LinkedFlightData.ts';
import './style.css';

interface FlightRowProps {
  flight: LinkedFlightData;
  onRefilter: () => Promise<void>;
}


const FlightRow: React.FC<FlightRowProps> = ({ flight, onRefilter }) => {
  const [updDate, setupdDate] = useState('')
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('access_token')
  const roleId = Number(localStorage.getItem('role_id'))
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
      await dispatch(getMyFlights({ token }));
    } catch (error) {
      console.error("Flight removal failed.", error);
    }
  };

  const openUpdCalendar = async (e: React.MouseEvent, flightId: number) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    dispatch(clearFlightState());
    await dispatch(getMyFlights({ token }));
    dispatch(setToBeUpdFlightId(flightId))
  }

  const handleUpdateFlight = async (e: React.MouseEvent<HTMLButtonElement>, flightId: number) => {
    e.preventDefault();
    if (!updDate) {
      alert('Please select a date and time.');
      return;
    }

    try {
      await dispatch(updateFlight({ flightId, newDepTime: updDate })).unwrap();
      setupdDate('');
      await dispatch(getMyFlights({ token }));
    } catch (error) {
      console.error("Flight update failed:", error);
    }
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
        <td>
          {flight.status !== 'active' ? (
            '---'
          ) : flight.remaining_tickets > 0 ? (
            flight.remaining_tickets
          ) : (
            'Sold-out!'
          )}
        </td>

        {/* <td>{flight.status}</td> */}
        <td>
          {flight.status !== 'active' ? (
            flight.status
          ) : roleId === 2 ? (
            <button
              className="buy-ticket-btn"
              disabled={flight.remaining_tickets === 0}
              style={{
                backgroundColor: flight.remaining_tickets === 0 ? '#ccc' : undefined,
                cursor: flight.remaining_tickets === 0 ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => handlePurchase(e, flight.flight_id)}
            >
              Buy ticket
            </button>
          ) : roleId === 3 ? (
            <>
              <button className="btn btn-danger" onClick={(e) => handleRemoval(e, flight.flight_id)}>
                Deactivate
              </button>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  console.log("CLICKED");
                  openUpdCalendar(e, flight.flight_id);
                }}
              >
                +
              </button>
            </>
          ) : (
            flight.status
          )}
        </td>


      </tr>

      {toBeUpdatedFlight === flight.flight_id && (
        <tr>
          <td colSpan={9} style={{ textAlign: 'center' }}>
            <input
              type="datetime-local"
              value={updDate}
              onChange={(e) => setupdDate(e.target.value)}
              className='datetime-input'
              required
            />
            <button className='update-button' onClick={(e) => handleUpdateFlight(e, flight.flight_id)}>Update</button>
          </td>
        </tr>
      )}

      {(targetFlightId === flight.flight_id || toBeUpdatedFlight === flight.flight_id) && (error || successMsg) && (
        <tr>
          <td colSpan={9} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
            {error || successMsg}
            {/* // ? (typeof error === 'object' && error !== null ? (error as any).message : error)
              // : (typeof successMsg === 'object' && successMsg !== null ? (successMsg as any).message : successMsg)} */}
          </td>
        </tr>
      )}
    </>
  );
};

export default FlightRow
