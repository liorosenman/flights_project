import axios from 'axios'
import {FlightData} from '../../models/flightdata.ts'
const SERVER = "http://127.0.0.1:8000/";

export const fetchFlights = async (): Promise<FlightData[]> => {
    const response = await axios.get(SERVER + "get_all_flights/");
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