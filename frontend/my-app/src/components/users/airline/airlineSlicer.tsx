import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LinkedAirline } from '../../../models/LinkedAirline';
import { RootState } from '../../../app/store';
import { getAirlineByUsernameService, getAllAirlinesService } from './airlineService.tsx';
import { createFlightService, removeAirlineService } from './airlineService.tsx';



export interface AirlineState {
  airlines: LinkedAirline[]
  error: string | null;
  loading: boolean;
  successMsg: string | null;
  targetAirlineId: number | null;
  filterError: string | null;
}

const initialState: AirlineState = {
  airlines: [],
  error: null,
  loading: false,
  successMsg: null,
  targetAirlineId: null,
  filterError: null
};

export const createFlight = createAsyncThunk<string, Record<string, any>, { state: RootState }>(
  'airline/createFlight',
  async (FlightData, { rejectWithValue, getState }) => {
    try {
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('Authentication token is missing.');
      }
      const response = await createFlightService(FlightData, token);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Unknown error'
      );
    }
  }
);

export const fetchAirlines = createAsyncThunk(
  'airline/fetchAirlines',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllAirlinesService();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch airlines');
    }
  }
);


export const removeAirline = createAsyncThunk<
  { message: string }, 
  number,                               // input: customer ID
  { state: RootState; rejectValue: string }
>(
  'airline/removeAirline',
  async (airlineId, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token available.');
    try {
      const result = await removeAirlineService(airlineId, token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Airline removal failed.');
    }
  }
);

export const getAirlineByUsername = createAsyncThunk<
  any,
  string,
  { state: RootState }
>(
  'airlines/getAirlineByUsername',
  async (username, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token');

    try {
      const result = await getAirlineByUsernameService(username, token);
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || 'Failed to fetch airline.';
      return rejectWithValue(errorMsg);
    }
  }
);



// export const getMyFlights = createAsyncThunk(
//   'airline/getMyFlights',
//   async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
//     try {
//       const data = await getMyFlightsService(id, token);
//       return data.flights;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to retrieve flights.');
//     }
//   }
// );

const AirlineSlicer = createSlice({
  name: 'airline',
  initialState,
  reducers: {
    clearAirlineState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMsg = null;
      state.targetAirlineId = null;
      state.filterError = null;
    },
    setTargetAirlineId: (state, action) => {
      state.targetAirlineId = action.payload;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAirlines.fulfilled, (state, action) => {
        state.loading = false;
        state.airlines = action.payload;
        console.log(state.airlines);
        
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
        state.successMsg = action.payload as string
        state.error = null
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Register failed';
        state.successMsg = null;
      })
      .addCase(removeAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message as string
        state.error = null
      })
      .addCase(removeAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Register failed';
        console.log("THE WROMG IS:",state.error);
        state.successMsg = null;
      })
      .addCase(getAirlineByUsername.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
        .addCase(getAirlineByUsername.fulfilled, (state, action) => {
          state.loading = false;
          state.airlines = [action.payload];
        })
        .addCase(getAirlineByUsername.rejected, (state, action) => {
          state.loading = false;
          state.error = null;
          state.filterError = action.payload as string;
        });

  }
});

export default AirlineSlicer.reducer;
export const selectAirlineState = (state: RootState) => state.airline
export const { clearAirlineState, setTargetAirlineId } = AirlineSlicer.actions;


