import axios from 'axios'
import { LinkedFlightData } from '../../models/LinkedFlightData.ts';
import {FlightSearchParams} from '../Flight/FlightFilters.tsx'

const SERVER = "http://127.0.0.1:8000";

export const fetchFlights = async (): Promise<LinkedFlightData[]> => {
  const response = await axios.get(SERVER + "/get_all_flights/");
  return response.data.flights;
};

// Specific airline's flights
export const getMyFlightsService = async (token: string) => {
  const response = await axios.get(`${SERVER}/get_my_flights/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const addTicketService = async (flight_id: number, token: string) => {
  const response = await axios.post(
    `${SERVER}/create_ticket/`,
    { flight_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}
  export const removeFlightService = async (id: number, token: string) => {
    const response = await axios.put(`${SERVER}/remove_flight/${id}/`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  export const updateFlightService = async (flightId: number, newDepTime: string, token: string) => {
    const response = await axios.put(
      `${SERVER}/update_flight/${flightId}/`,
      { new_dep_time: newDepTime },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  };

  // flightService.ts
export const getFlightByIdService = async (flightId: number) => {
  const response = await axios.get(`${SERVER}/get_flight_by_id/${flightId}/`);
  return response.data;
};



export const getFlightsByAirlineIdService = async (airlineId: number) => {
  const response = await axios.get(`${SERVER}/get_flights_by_airline_id/${airlineId}/`);
  return response.data;
};



export const getAllAirlinesService = async () => {
  const response = await axios.get(`${SERVER}/get_all_airlines/`);
  return response.data;
};


  export const getFlightsByParametersService = async (params: FlightSearchParams) => {
    const response = await axios.post(`${SERVER}/get_flights_by_parameters/`, params);
    return response.data;
  };

  export const getArrivalFlightsService = async (countryId: number) => {
    console.log("THE CHOSEN COUNTRY IS: ", countryId);
    
    const response = await axios.get(`${SERVER}/get_arrival_flights/${countryId}/`);
    return response.data;
  };

  export const getDepartureFlightsService = async (countryId: number) => {
    console.log("THE CHOSEN COUNTRY IS: ", countryId);
    
    const response = await axios.get(`${SERVER}/get_departure_flights/${countryId}/`);
    return response.data;
  };



