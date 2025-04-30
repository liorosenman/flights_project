import axios from 'axios';

const SERVER = "http://127.0.0.1:8000";

export const getAllCustomersService = async (token: string) => {
  console.log("LOOKLOOK");
  
  const response = await axios.get(`${SERVER}/get_all_customers/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  
  return response.data;
};

export const removeCustomerService = async (customerId: number, token: string) => {
  const response = await axios.put(`${SERVER}/remove_customer/${customerId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

