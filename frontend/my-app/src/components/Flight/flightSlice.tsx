import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFlights } from './FlightAPI';
import { FlightData } from '../../models/flightdata';
import { RootState } from '../../app/store.ts';

interface FlightState {
    flights: FlightData[];
    loading: boolean;
    error: string | null;
  }

  const initialState: FlightState = {
    flights: [],
    loading: false,
    error: null,
  };

  export const loadFlights = createAsyncThunk<FlightData[], void, { rejectValue: string }>(
    'flight/loadFlights',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchFlights();
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch flights');
      }
    }
  );

  const flightSlice = createSlice({
    name: 'flight',
    initialState,
    reducers: {},
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
        });
    },
  });

  export default flightSlice.reducer;
  export const selectFlights = (state: RootState) => state.flight.flights;
