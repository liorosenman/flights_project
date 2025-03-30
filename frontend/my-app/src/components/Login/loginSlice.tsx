import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest } from './LoginAPI.tsx';
import axios from 'axios';
import { UserToken } from '../../models/UserToken.ts';

interface LoginState {
  token : UserToken | null;
  error : string;
  loading: boolean;
  // error: string | null;
}

const initialState: LoginState = {
  token : null,
  error : "",
  loading: false,
}

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }: { username: string; password: string }): Promise<UserToken> => {
    return await loginRequest(username, password);
  }
);


const flightSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = ""
      })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export default flightSlice.reducer;
