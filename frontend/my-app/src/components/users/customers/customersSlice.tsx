import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {LinkedCustomer} from '../../../models/LinkedCustomer.ts'
import { RootState } from '../../../app/store.ts';
import { getAllCustomersService } from './customerService.tsx';

interface CustomerState {
    customers: LinkedCustomer[];
    loading: boolean;
    error: string | null;
  }

const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: null,
  };

  export const fetchCustomers = createAsyncThunk(
    'customer/fetchCustomers',
    async (_, { getState, rejectWithValue }) => {
      const token = (getState() as RootState).login.token;
      if (!token) return rejectWithValue('No token');
      try {
        return await getAllCustomersService(token);
      } catch (err: any) {
        return rejectWithValue(err.error);
      }
    }
  );

  const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
      clearState: (state) => {
        state.loading = false;
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder
        .addCase(fetchCustomers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCustomers.fulfilled, (state, action) => {
          state.customers = action.payload;
          console.log(state.customers);
          
          state.loading = false;
        })
        .addCase(fetchCustomers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });

  export default customersSlice.reducer;