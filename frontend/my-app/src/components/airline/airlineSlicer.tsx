import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {Country} from '../../models/country.ts'
import { Airline } from '../../models/airline.ts';
import { createFlightService, getAirlines } from './airlineService.tsx';
import { RootState } from '../../app/store.ts';
import { useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';

interface AirlineState {
    airlines : Airline[]
    error: string | null;
    loading: boolean;
    SuccessMessage: string | null;
  }
  
const initialState: AirlineState = {
  airlines : [],
  error : null,
  loading: false,
  SuccessMessage: null

};

export const createFlight = createAsyncThunk<string, Record<string, any>, { state: RootState }>(
  'airline/createFlight',
  async (FlightData, { rejectWithValue, getState }) => {
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCC");
      
    try {
      const token = getState().login.token;
      console.log(token);
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            
      const response = await createFlightService(FlightData, token);
      console.log(response);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Unknown error');
    }
  }
);

// export const createFlight = createAsyncThunk<string, Record<string, any>>(
//     'airline/createFlight',
//     async (FlightData, { rejectWithValue }) => {
//       try {
//         const response = await createFlightService(FlightData);
//         console.log(response);
//         return response.data.message;
//       } catch (error:any) { 
//         return rejectWithValue(error.response?.data?.error  || 'Unknown error');
//       }
//     }
//   );

export const fetchAirlines = createAsyncThunk<Airline[], void>(
  'airline/fetchAirlines',
  async (_, thunkAPI) => {
    try {
      const response = await getAirlines();
      return response.data.airlines as Airline[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || 'Unknown error'
      );
    }
  }
);

const AirlineSlicer = createSlice({
name: 'airline',
initialState,
reducers: {},
extraReducers: (builder) => {
  builder
    .addCase(fetchAirlines.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(fetchAirlines.fulfilled, (state, action) => {
      state.loading = false;
      state.airlines = action.payload;
    })
    .addCase(fetchAirlines.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
     .addCase(createFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
          })
     .addCase(createFlight.fulfilled, (state, action) => {
        state.loading = false;
        state.SuccessMessage = action.payload as string
        state.error = null
          })
     .addCase(createFlight.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || action.error.message  ||'Register failed';
          state.SuccessMessage = null;
          })
  }
});

export default AirlineSlicer.reducer;
export const selectAirlineState = (state: RootState) => state.airline;
