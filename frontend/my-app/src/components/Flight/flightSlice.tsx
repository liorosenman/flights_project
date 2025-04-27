import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTicketService, fetchFlights, removeFlightService, updateFlightService } from './flightService.tsx';
import { FlightData } from '../../models/flightdata';
import { AppDispatch, RootState } from '../../app/store.ts';
import { getMyFlightsService} from './flightService.tsx';
import axios from 'axios';

export interface FlightState {
    flights: FlightData[];
    loading: boolean;
    error: string | null;
    successMsg: string | null;
    targetFlightId: number | null;
    toBeUpdatedFlight: number | null;
  }

  const initialState: FlightState = {
    flights: [],
    loading: false,
    error: null,
    successMsg: null,
    targetFlightId: null,
    toBeUpdatedFlight: null,
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

export const removeFlight = createAsyncThunk<
  string,                           
  { flight_id: number },              
  { rejectValue: string; dispatch: AppDispatch, state:RootState } 
>(
  'flights/removeFlight',
  async ({ flight_id }, { dispatch, rejectWithValue, getState }) => { 
    const token = getState().login.token;
    if (!token) return rejectWithValue('No token');
    try {
      dispatch(setTargetFlightId(flight_id)); 
      const response = await removeFlightService(flight_id, token); 
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove flight.');
    }
  }
);

export const updateFlight = createAsyncThunk<
  string,  
  { flightId: number; newDepTime: string },
  { state: RootState }
>(
  'flight/updateFlight',
  async ({ flightId, newDepTime }, { getState, rejectWithValue }) => {
    // clearFlightState();
    try {
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('No access token available.');
      }
      const result = await updateFlightService(flightId, newDepTime, token);
      return result.message; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Flight update failed.'
      );
    }
  }
);




  const flightSlice = createSlice({
    name: 'flight',
    initialState,
    reducers: {
      clearFlightState: (state) => {
        // state.flights = [];
        state.loading = false;
        state.error = null;
        state.successMsg = null;
        state.toBeUpdatedFlight = null;
      },

      setTargetFlightId: (state, action) => {
        state.targetFlightId = action.payload;
      },

      setToBeUpdFlightId: (state, action) => {
        state.toBeUpdatedFlight = action.payload;
    },
  },
    extraReducers: (builder) => {
      builder
        .addCase(loadFlights.pending, (state) => {
          state.loading = true;
          state.error = "";
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
          state.error = action.payload as string || 'Flight removal failure.';
        })
        .addCase(updateFlight.pending, (state) => {
          state.loading = true;
          state.error = ""
        })
        .addCase(updateFlight.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.successMsg = action.payload as string
        })
        .addCase(updateFlight.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Flight removal failure.';
        });

    }
  });

  export default flightSlice.reducer;
  export const selectFlightsState = (state: RootState) => state.flight
  export const { clearFlightState, setTargetFlightId, setToBeUpdFlightId} = flightSlice.actions;
