import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFlights } from './flightService.tsx';
import { FlightData } from '../../models/flightdata';
import { RootState } from '../../app/store.ts';
import { getMyFlightsService} from './flightService.tsx';

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
        });
    },
  });

  export default flightSlice.reducer;
  export const selectFlights = (state: RootState) => state.flight.flights;
