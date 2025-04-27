import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTicketService, fetchFlights, removeFlightService } from './flightService.tsx';
import { FlightData } from '../../models/flightdata';
import { RootState } from '../../app/store.ts';
import { getMyFlightsService} from './flightService.tsx';
import axios from 'axios';

export interface FlightState {
    flights: FlightData[];
    loading: boolean;
    error: string | null;
    successMsg: string | null;
    targetFlightId: number | null;
  }

  const initialState: FlightState = {
    flights: [],
    loading: false,
    error: null,
    successMsg: null,
    targetFlightId: null,
  };

  export const loadFlights = createAsyncThunk<FlightData[], void, { rejectValue: string }>(
    'flight/loadFlights',
    async (_, { rejectWithValue }) => {
      try {
        console.log("BBBBBBBBBBBBBBBBBBB");
        
        return await fetchFlights();
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch flights');
      }
    }
  );

export const getMyFlights = createAsyncThunk(
  'airline/getMyFlights',
  async ({ token }: { token: string | null }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue('No token provided.');
      }
      const data = await getMyFlightsService(token);
      return data.flights;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to retrieve flights.');
    }
  }
);

export const addTicket = createAsyncThunk<
  any,
  { flight_id: number },
  { state: RootState }
>(
  'flight/addTicket',
  async ({ flight_id }, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No token');

    try {
      const result = await addTicketService(flight_id, token);
      console.log(result);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ticket purchase failed');
    }
  }
);

export const removeFlight = createAsyncThunk<string,number,  { state: RootState }>(
  'flight/removeFlight',
  async (flightId, { getState, rejectWithValue }) => {
    try {
      const token = getState().login.token; // adjust if your login slice is different
      if (!token) {
        return rejectWithValue('No access token available');
      }
      const result = await removeFlightService(flightId, token);
      return result.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Flight removal failed.');
    }
  }
);




  const flightSlice = createSlice({
    name: 'flight',
    initialState,
    reducers: {
      clearFlightState: (state) => {
        state.flights = [];
        state.loading = false;
        state.error = null;
        state.successMsg = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadFlights.pending, (state) => {
          state.loading = true;
          state.error = ""
        })
        .addCase(loadFlights.fulfilled, (state, action) => {
            state.loading = false;
            state.flights = action.payload
        })
        .addCase(loadFlights.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Loading flights failed';
        })
        .addCase(getMyFlights.pending, (state) => {
          state.loading = true;
          state.error = ""
        })
        .addCase(getMyFlights.fulfilled, (state, action) => {
            state.loading = false;
            state.flights = action.payload
        })
        .addCase(getMyFlights.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Loading flights failed';
        })
        .addCase(addTicket.pending, (state) => {
          state.loading = true;
          state.error = ""
        })
        .addCase(addTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.successMsg = action.payload as string
            
        })
        .addCase(addTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Ticket purchasing failure.';
        })
        .addCase(removeFlight.pending, (state) => {
          state.loading = true;
          state.error = ""
        })
        .addCase(removeFlight.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.successMsg = action.payload as string
        })
        .addCase(removeFlight.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Ticket purchasing failure.';
        });
    },
  });

  export default flightSlice.reducer;
  export const selectFlightsState = (state: RootState) => state.flight
  export const { clearFlightState } = flightSlice.actions;