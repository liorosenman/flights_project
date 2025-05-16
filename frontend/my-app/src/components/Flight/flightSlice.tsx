import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTicketService, fetchFlights, getArrivalFlightsService, getDepartureFlightsService, getFlightsByAirlineIdService, getFlightsByParametersService, removeFlightService, updateFlightService } from './flightService.tsx';
import { AppDispatch, RootState } from '../../app/store.ts';
import { getMyFlightsService, getFlightByIdService} from './flightService.tsx';
import { LinkedFlightData } from '../../models/LinkedFlightData.ts';
import {FlightSearchParams} from '../Flight/FlightFilters.tsx'

export interface FlightState {
    flights: LinkedFlightData[];
    loading: boolean;
    error: string | null; // Error for a single flight row.
    generalErr: string | null;
    successMsg: string | null;
    targetFlightId: number | null;
    toBeUpdatedFlight: number | null;
  }

  const initialState: FlightState = {
    flights: [],
    loading: false,
    error: null,
    generalErr: null,
    successMsg: null,
    targetFlightId: null,
    toBeUpdatedFlight: null,
  };

  export const loadFlights = createAsyncThunk<LinkedFlightData[], void, { rejectValue: string }>(
    'flight/loadFlights',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchFlights();
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch flights');
      }
    }
  );

  //The flights are for a specific airline.
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
  async ({ flight_id }, { getState, rejectWithValue, dispatch }) => {
    
    const token = getState().login.token;
    if (!token) return rejectWithValue('No token');

    try {
      dispatch(setTargetFlightId(flight_id));
      const result = await addTicketService(flight_id, token);
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
      return response;
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
    try {
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('No access token available.');
      }
      const result = await updateFlightService(flightId, newDepTime, token);
      return result.message; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Flight update failed.')
        // { message: error.response?.data?.message || 'Flight update failed.' });
    }
  }
);

export const getFlightById = createAsyncThunk<
  any, 
  number,
  { state: RootState }
>(
  'flight/getFlightById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('No access token available.');
      }
      const result = await getFlightByIdService(id, token);
      return result.flight;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Flight retrieval failed.'
      );
    }
  }
);

export const getFlightsByAirlineId = createAsyncThunk<
  any, 
  number
>(
  'flight/getFlightsByAirlineId',
  async (airlineId, { rejectWithValue }) => {
    try {
      const result = await getFlightsByAirlineIdService(airlineId);
      return result.flights; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve airline flights.'
      );
    }
  }
);

export const getArrivalFlights = createAsyncThunk<
  any,   
  number  // country ID
>(
  'flight/getArrivalFlights',
  async (countryId, { rejectWithValue }) => {
    try {
      const result = await getArrivalFlightsService(countryId);
      return result.flights; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve arrival flights.'
      );
    }
  }
);

export const getFlightsByParameters = createAsyncThunk<
  any, 
  FlightSearchParams
>(
  'flight/getFlightsByParameters',
  async (params, { rejectWithValue }) => {
    try {
      const result = await getFlightsByParametersService(params);
      return result.flights;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve flights.'
      );
    }
  }
);

export const getDepartureFlights = createAsyncThunk<
  any,    
  number  // country ID
>(
  'flight/getDepartureFlights',
  async (countryId, { rejectWithValue }) => {
    try {
      const result = await getDepartureFlightsService(countryId);
      return result.flights;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve arrival flights.'
      );
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
        state.toBeUpdatedFlight = null;
        state.targetFlightId = null;
        state.generalErr = null;
      },
      clearFlights: (state) => {
        state.flights = []
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
          state.generalErr = action.payload as string || 'Loading flights failed';
        })
        .addCase(addTicket.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.successMsg = action.payload.message as string
        })
        .addCase(addTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || 'Ticket purchasing failure.';
          console.log(state.error);
          
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
          console.log(action.payload);
          state.loading = false;
          state.error = action.payload as string || 'Flight update failed';
          console.log(state.error);
          
        })
        .addCase(getFlightById.pending, (state) => {
          state.loading = true;
          state.generalErr = ""
        })
        .addCase(getFlightById.fulfilled, (state, action) => {
            state.loading = false;
            state.flights = [action.payload];
            console.log(state.flights);
            
        })
        .addCase(getFlightById.rejected, (state, action) => {
          clearFlightState();
          state.loading = false;
          state.generalErr = action.payload as string || 'Flight loading failure.';
        })
      .addCase(getFlightsByAirlineId.pending, (state) => {
        state.loading = true;
        state.generalErr = ""
      })
      .addCase(getFlightsByAirlineId.fulfilled, (state, action) => {
          state.loading = false;
          state.flights = action.payload;
      })
      .addCase(getFlightsByAirlineId.rejected, (state, action) => {
        clearFlightState();
        state.flights = []
        state.loading = false;
        state.generalErr = action.payload as string || 'Flights loading failure.';
      })
      .addCase(getFlightsByParameters.pending, (state) => {
        state.loading = true;
        state.generalErr = ""
      })
      .addCase(getFlightsByParameters.fulfilled, (state, action) => {
          state.loading = false;
          state.flights = action.payload;
      })
      .addCase(getFlightsByParameters.rejected, (state, action) => {
        clearFlightState();
        state.loading = false;
        state.generalErr = action.payload as string || 'Flights loading failure.';
      })
      .addCase(getArrivalFlights.pending, (state) => {
        state.loading = true;
        state.generalErr = ""
      })
      .addCase(getArrivalFlights.fulfilled, (state, action) => {
          state.loading = false;
          state.flights = action.payload;
      })
      .addCase(getArrivalFlights.rejected, (state, action) => {
        clearFlightState();
        state.loading = false;
        state.generalErr = action.payload as string || 'Flights loading failure.';
      })
      .addCase(getDepartureFlights.pending, (state) => {
        state.loading = true;
        state.generalErr = ""
      })
      .addCase(getDepartureFlights.fulfilled, (state, action) => {
          state.loading = false;
          state.flights = action.payload;
      })
      .addCase(getDepartureFlights.rejected, (state, action) => {
        clearFlightState();
        state.loading = false;
        state.generalErr = action.payload as string || 'Flights loading failure.';
      });
    }
  });

  export default flightSlice.reducer;
  export const selectFlightsState = (state: RootState) => state.flight
  export const { clearFlightState, setTargetFlightId, setToBeUpdFlightId, clearFlights} = flightSlice.actions;
