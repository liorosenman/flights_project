import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { TicketData } from '../../models/TicketData.ts';
import {  cancelTicketService, getMyTicketsService } from './ticketService.tsx';

export interface ticketstate {
    tickets : TicketData[]
    error: string | null;
    loading: boolean;
    SuccessMessage: string | null;
    targetTicketId: string | null;
  }
  
const initialState: ticketstate = {
  tickets : [],
  error : null,
  loading: false,
  SuccessMessage: null,
  targetTicketId: null,
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

export const cancelTicket = createAsyncThunk<
  string,
  number, 
  { state: RootState }
>(
  'ticket/cancelTicket',
  async (ticketId, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setTargetTicketId(ticketId))
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('No access token available.');
      }

      const result = await cancelTicketService(ticketId, token);
      return result.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ticket cancelation failed.'
      );
    }
  }
);

const ticketslicer = createSlice({
name: 'ticket',
initialState,
reducers: {
  clearTicketsState: (state) => {
    state.tickets = [];
    state.loading = false;
    state.error = null;
    state.SuccessMessage = null;
    state.targetTicketId = null;
  },
  setTargetTicketId: (state, action) => {
    state.targetTicketId = action.payload;
  },
},
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
     .addCase(cancelTicket.pending, (state) => {
        state.loading = true;
        state.error = ""
          })
     .addCase(cancelTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.SuccessMessage = action.payload as string
        state.error = null
          })
     .addCase(cancelTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || action.error.message  ||'Register failed';
          state.SuccessMessage = null;
          })
  }
});

export default ticketslicer.reducer;
export const selectTicketState = (state: RootState) => state.ticket;
export const { clearTicketsState, setTargetTicketId} = ticketslicer.actions;
