import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000';

export const createFlightService = async (flightData: Record<string, any>, token: string) => {
    return await axios.post(SERVER + "/create_flight/", flightData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  // export const getAllAirlinesService = async () => {
  //   const response = await axios.get(`${SERVER}/get_all_airlines/`);
  //   return response.data;
  // };

  export const getAllAirlinesService = async (token: string) => {
  const response = await axios.get(`${SERVER}/get_all_airlines/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  
  return response.data;
};

  
  export const removeAirlineService = async (airlineId: number, token: string) => {
    const response = await axios.put(`${SERVER}/remove_airline/${airlineId}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("FROM THE SLICER:", response);
    
    return response.data;
  };

  export const getAirlineByUsernameService = async (username: string, token: string) => {
    const response = await axios.get(`${SERVER}/get_airline_by_username/${username}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.airline
  };


