import axios from "axios";
import { UserToken } from "../../models/UserToken";
import { ErrorResponse } from "../../models/ErrorResponse"

const SERVER = 'http://127.0.0.1:8000/'

export const loginRequest = async (username: string, password: string) :  Promise<any | ErrorResponse> =>{
    try {
      const response = await axios.post<any>(SERVER + 'login/', { username, password });
      return { token: response.data.access }
    }catch (error:any){
      if (error.response && error.response.data && error.response.data.detail) {
        console.log("ERROR")
        console.log(error.response.data.detail)
        return { error: error.response.data.detail };
    }
    return { error: 'Login failed' };
  }
}

export const logoutUser = async (refresh_token: string) => {
  return await axios.post(SERVER + 'logout_user/', {
    refresh_token: refresh_token,
  });
};
   



  


