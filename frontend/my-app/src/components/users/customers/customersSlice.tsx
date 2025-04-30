import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {LinkedCustomer} from '../../../models/LinkedCustomer.ts'
import { RootState } from '../../../app/store.ts';
import { getAllCustomersService, removeCustomerService } from './customerService.tsx';

interface CustomerState {
    customers: LinkedCustomer[];
    loading: boolean;
    error: string | null;
    successMsg: string | null;
    targetCustomerId : number | null;
    isfiltered: boolean;
  }

const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: null,
    successMsg: null,
    targetCustomerId : null,
    isfiltered: false
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

  export const removeCustomer = createAsyncThunk<
  { message: string },  // return type
  number,                               // input: customer ID
  { state: RootState; rejectValue: string }
>(
  'customer/removeCustomer',
  async (customerId, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token available.');

    try {
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      
      const result = await removeCustomerService(customerId, token);
      console.log(result);
      
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Customer removal failed.');
    }
  }
);

  const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
      clearCustomerState: (state) => {
        state.loading = false;
        state.error = null;
        state.successMsg = null;
        state.targetCustomerId = null;
      },
      setTargetCustomerId: (state, action) => {
        state.targetCustomerId = action.payload;
      }
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
        })
        .addCase(removeCustomer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(removeCustomer.fulfilled, (state, action) => {
          state.loading = false;
          state.successMsg = action.payload.message as string;
        })
        .addCase(removeCustomer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          
          
        });
    },
  });

  export default customersSlice.reducer;
  export const selectCustomerState = (state: RootState) => state.customer
  export const { clearCustomerState, setTargetCustomerId} = customersSlice.actions;