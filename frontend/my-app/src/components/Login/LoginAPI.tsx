import axios from "axios";
import { UserToken } from "../../models/UserToken";

const SERVER = 'http://127.0.0.1:8000/'

export const loginRequest = async (username: string, password: string): Promise<UserToken> => {
    const response = await axios.post<UserToken>(SERVER + 'login/', { username, password });
    return response.data;
  };

