import axios from "axios";
import { UserToken } from "../../models/UserToken";
import { ErrorResponse } from "../../models/ErrorResponse"

const SERVER = 'http://127.0.0.1:8000/'

export const loginRequest = async (username: string, password: string) :  Promise<UserToken | ErrorResponse> =>{
    try {
      const response = await axios.post<UserToken>(SERVER + 'login/', { username, password });
      return response.data
    }catch (error:any){
      if (error.response && error.response.data && error.response.data.detail) {
        console.log("ERROR")
        console.log(error.response.data.detail)
        return { error: error.response.data.detail };
    }
    return { error: 'Login failed' };
  }
    
  }


