import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

// export const createFlightService = async (FlightData) => {
//     const x = await axios.post(SERVER + 'create_flight/', FlightData);
//     console.log(x);
//     return x

// }

export const createFlightService = async (flightData: Record<string, any>, token: string) => {
    return await axios.post(SERVER + "create_flight/", flightData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export const getAirlines = async () => {
    return await axios.get(SERVER + 'get_all_airlines/');
}
