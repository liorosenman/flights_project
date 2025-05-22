import axios from 'axios';

const SERVER = "http://127.0.0.1:8000";

export const getAllAdminsService = async (token: string) => {
  
  const response = await axios.get(`${SERVER}/get_all_admins/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeAdminService = async (adminId: number, token: string) => {
    const response = await axios.put(`${SERVER}/remove_admin/${adminId}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } 

export const getAdminByUsernameService = async (username: string, token: string) => {
  const response = await axios.get(`${SERVER}/get_admin_by_username/${username}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.admin;
};

