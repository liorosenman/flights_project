import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

export const createFlightService = async (flightData: Record<string, any>, token: string) => {
    return await axios.post(SERVER + "create_flight/", flightData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

export const getAirlines = async () => {
    return await axios.get(SERVER + 'get_all_airlines/');
}

export const getMyFlightsService = async (id: number, token: string) => {
  const response = await axios.get(`${SERVER}/get_my_flights/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
