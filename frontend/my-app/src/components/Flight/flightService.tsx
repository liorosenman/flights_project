import axios from 'axios'
import { FlightData } from '../../models/flightdata.ts'
import { LinkedFlightData } from '../../models/LinkedFlightData.ts';

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
export const getFlightByIdService = async (id: number, token: string) => {
  const response = await axios.get(`${SERVER}/get_flight_by_id/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};




