// FlightBoard.js
import React, { useState, useEffect } from 'react';
import FlightRow from "./FlightRow.tsx";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import { getArrivalFlights, getDepartureFlights, getFlightById, getFlightsByAirlineId, getFlightsByParameters, getMyFlights, loadFlights, selectFlightsState } from './flightSlice.tsx'
import { UserRole } from '../../models/userRole.ts';
import { clearFlightState } from './flightSlice.tsx';
import FlightFilters from './FlightFilters.tsx'
import { FlightFilterOptions } from '../../models/FlightFilterOptions.ts';

const FlightsBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFlightsState).flights;
  const token = localStorage.getItem('access_token')
  const roleId = Number(localStorage.getItem('role_id'))
  const { generalErr } = useAppSelector(selectFlightsState);
  const [lastFilters, setLastFilters] = useState({
    type: FlightFilterOptions.GET_ALL_FLIGHTS,
  });

  const handleFilterClick = async (filters: any) => {
    setLastFilters(filters);
    switch (filters.type) {
      case FlightFilterOptions.GET_ALL_FLIGHTS:
        await dispatch(loadFlights());
        // setLastFilters({ type: FlightFilterOptions.GET_ALL_FLIGHTS })
        break;

      case FlightFilterOptions.GET_FLIGHT_BY_ID:
        if (filters.flightId != null && filters.flightId > 0) {
          await dispatch(getFlightById(filters.flightId));
          // setLastFilters({ type: FlightFilterOptions.GET_FLIGHT_BY_ID })
        }
        break;

      case FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID:
        if (filters.airlineId != null && filters.airlineId > 0) {
          await dispatch(getFlightsByAirlineId(filters.airlineId))
          // setLastFilters({ type: FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID })
        }
        break;

      case FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS:
        if (filters.originCountry && filters.destinationCountry && filters.departureDate) {
          await dispatch(getFlightsByParameters({
            origin_country_id: Number(filters.originCountry),
            dest_country_id: Number(filters.destinationCountry),
            dep_date: filters.departureDate
          }));
          // setLastFilters({ type: FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS })
        }
        break;

      case FlightFilterOptions.GET_ARRIVAL_FLIGHTS:
        if (filters.country) {
          await dispatch(getArrivalFlights(filters.country))
          // setLastFilters({ type: FlightFilterOptions.GET_ARRIVAL_FLIGHTS })
        }
        break;

      case FlightFilterOptions.GET_DEPARTURE_FLIGHTS:
        if (filters.country) {
          await dispatch(getDepartureFlights(filters.country))
          // setLastFilters({ type: FlightFilterOptions.GET_DEPARTURE_FLIGHTS })
        }
        break;

      default:
        console.warn("Unhandled filter type:", filters.type);
        break;
    }
  };

  useEffect(() => {
    dispatch(clearFlightState());
    (async () => {
      if (token && roleId === UserRole.AIRLINE) {
        await dispatch(getMyFlights({ token }));
      } else {
        await dispatch(loadFlights());
      }
    })();
  }, []);


  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 fw-bold text-primary">Flights Board</h1>

      {generalErr && (
        <div className="text-center text-danger fw-semibold mb-3">
          <h4>{generalErr}</h4>
        </div>
      )}

      {(!token || roleId === 2) && (
        <div className="mb-4">
          <FlightFilters onFilter={handleFilterClick} />
        </div>
      )}


      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white shadow-sm rounded text-center align-middle" style={{ maxWidth: '95%', margin: '0 auto' }}>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Airline</th>
              <th>Origin Country</th>
              <th>Destination Country</th>
              <th>Departure Time</th>
              <th>Landing Time</th>
              <th>Remaining Tickets</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <FlightRow key={flight.flight_id} flight={flight} onRefilter={() => handleFilterClick(lastFilters)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default FlightsBoard;

