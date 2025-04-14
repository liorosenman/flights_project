import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest } from './LoginAPI.tsx';
import axios from 'axios';
import { UserToken } from '../../models/UserToken.ts';
import { RootState } from '../../app/store.ts';
// import { UserToken } from '../../models/UserToken.ts';

interface LoginState {
  token : any | null;
  error: string | null;
  loading: boolean;
  // error: string | null;
}

const initialState: LoginState = {
  token : null,
  error : null,
  loading: false,
}

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }: { username: string; password: string }, 
    {rejectWithValue}
   ) => {
    try
    {
    const result = await loginRequest(username, password);
    if (result.error) {
      return rejectWithValue(result.error)
    }
    console.log(result);
    return result
    // if (result && typeof result === 'object' && 'data.access' in result) {
    //    return result.data.access
    // }
  }catch (error:any){
    return rejectWithValue(error.message || 'Unexpected error occurred');
  }
  }
);


const loginSlice = createSlice({
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
          state.token = action.payload.token
          
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed';
      });
  },
});


export default loginSlice.reducer;
export const selectLoginState = (state: RootState) => state.login;
