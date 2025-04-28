// FlightBoard.js
import React, { useState, useEffect } from 'react';
import { FlightData } from '../../models/flightdata.ts';
import FlightRow from "./FlightRow.tsx";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import { getFlightById, getMyFlights, loadFlights, selectFlightsState } from './flightSlice.tsx'
import { selectLoginState } from '../Login/loginSlice.tsx';
import { selectUserRoleId } from '../Login/loginSlice.tsx';
import { UserRole } from '../../models/userRole.ts';
import Menu from '../Menu/menuComp.tsx';
import { clearFlightState } from './flightSlice.tsx';
import FlightFilters from './FlightFilters.tsx'
import { FlightFilterOptions } from '../../models/FlightFilterOptions.ts';


const FlightsBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFlightsState).flights;
  const { roleId, userId, token } = useAppSelector(selectLoginState);
  const [lastFilters, setLastFilters] = useState<any>(null);

  const handleFilterClick = async (filters: any) => {

    switch (filters.type) {
      case FlightFilterOptions.GET_ALL_FLIGHTS:
        await dispatch(loadFlights());
        break;
  
      case FlightFilterOptions.GET_FLIGHT_BY_ID:
        if (filters.flightId != null && filters.flightId > 0) {
          await dispatch(getFlightById(filters.flightId));
        }
        break;
  
      case FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID:
        if (filters.airlineId != null && filters.airlineId > 0) {
          console.log("Airline ID filter chosen:", filters.airlineId);
        }
        break;
  
      case FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS:
        if (filters.originCountry && filters.destinationCountry && filters.departureDate) {
          console.log("Parameters filter chosen:", filters);
        }
        break;
  
      case FlightFilterOptions.GET_ARRIVAL_FLIGHTS:
      case FlightFilterOptions.GET_DEPARTURE_FLIGHTS:
        if (filters.country) {
          console.log("Country-based filter chosen:", filters.country);
        }
        break;
  
      default:
        console.warn("Unhandled filter type:", filters.type);
        break;
    }
  };
  



  useEffect(() => {
  console.log("THe role id is ", roleId);
  
    (async () => {
      if (token) {
        if (roleId === UserRole.AIRLINE) {
          await dispatch(getMyFlights({ token }));
        }
        if (roleId === UserRole.CUSTOMER){
          await dispatch(loadFlights());
        }
      }

    })();
  }, [])

  useEffect(() => {
    return () => {
      dispatch(clearFlightState());
    };
  }, [dispatch]);



  return (
    <div>
      <Menu />
      <h1>Flight Board</h1>
      <FlightFilters onFilter={handleFilterClick} />
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
            <FlightRow flight={flight} onRefilter={() => handleFilterClick()}  />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightsBoard;


