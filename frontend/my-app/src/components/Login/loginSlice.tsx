import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch flights


interface LoginState {
  // data: any[];      
  // loading: boolean;
  // error: string | null;
}

const initialState: LoginState = {
  // loading: false,
  // error: null,
};

export const loginUser = createAsyncThunk(
  'login/loginUser',



const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        // state.loading = true;
        // state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        // state.loading = false;
        // state.data = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        // state.loading = false;
        // state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default flightSlice.reducer;
