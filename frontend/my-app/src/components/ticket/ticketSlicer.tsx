import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {Country} from '../../models/country.ts'
import { Airline } from '../../models/airline.ts';
import { RootState } from '../../app/store.ts';
import { useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import { FlightData } from '../../models/flightdata.ts';
import { selectUserRoleId } from '../Login/loginSlice.tsx';
import { TicketData } from '../../models/TicketData.ts';
import {  getMyTicketsService } from './ticketService.tsx';

export interface ticketstate {
    tickets : TicketData[]
    error: string | null;
    loading: boolean;
    SuccessMessage: string | null;
  }
  
const initialState: ticketstate = {
  tickets : [],
  error : null,
  loading: false,
  SuccessMessage: null

};

export const getMyTickets = createAsyncThunk(
  'ticket/getMyFlights',
  async ({ token }: { token: string | null }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue('No token provided.');
      }
      const data = await getMyTicketsService(token);
      return data.tickets;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to retrieve Tickets.');
    }
  }
);



const ticketslicer = createSlice({
name: 'ticket',
initialState,
reducers: {},
extraReducers: (builder) => {
  builder
    .addCase(getMyTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getMyTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload;
    })
    .addCase(getMyTickets.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    //  .addCase(createFlight.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //       })
    //  .addCase(createFlight.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.SuccessMessage = action.payload as string
    //     state.error = null
    //       })
    //  .addCase(createFlight.rejected, (state, action) => {
    //       state.loading = false;
    //       state.error = action.payload as string || action.error.message  ||'Register failed';
    //       state.SuccessMessage = null;
    //       })
  }
});

export default ticketslicer.reducer;
export const selectTicketState = (state: RootState) => state.ticket;

