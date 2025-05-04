import axios from 'axios';

const SERVER = "http://127.0.0.1:8000";

export const getAllCustomersService = async (token: string) => {
  const response = await axios.get(`${SERVER}/get_all_customers/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  
  return response.data;
};

// export const removeCustomerService = async (customerId: number, token: string) => {
//   const response = await axios.put(`${SERVER}/remove_customer/${customerId}/`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

export const removeCustomerService = async (customerId: number, token: string) => {
  const response = await axios.put(`${SERVER}/remove_customer/${customerId}/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCustomerByUsernameService = async (username: string, token: string) => {
  const response = await axios.get(`${SERVER}/get_customer_by_username/${username}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.customer;
};

export const updateCustomerService = async (data: any, token: string) => {
  console.log(data);
  const response = await axios.put(`${SERVER}/update_customer/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data);
  return response.data;
};

