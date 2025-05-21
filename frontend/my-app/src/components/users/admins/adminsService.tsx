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

// export const removeAdminService = async (adminId: number, token: string) => {
//   const response = await axios.put(`${SERVER}/remove_admin/${adminId}/`, {}, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

export const removeAdminService = async (adminId: number, token: string) => {
  try {
    const res = await axios.put(`${SERVER}/remove_admin/${adminId}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDD");
    console.log(res);
    return res.data;
  } catch (err: any) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEE");
    
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error('Failed to remove admin.');
  }
};


export const getAdminByUsernameService = async (username: string, token: string) => {
  const response = await axios.get(`${SERVER}/get_admin_by_username/${username}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.admin;
};

