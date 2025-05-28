import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {LinkedCustomer} from '../../../models/LinkedCustomer.ts'
import { RootState } from '../../../app/store.ts';
import { getAllCustomersService, getCustomerByUserIdService, getCustomerByUsernameService, removeCustomerService, updateCustomerService } from './customerService.tsx';

interface CustomerState {
    customers: LinkedCustomer[]
    loading: boolean;
    error: string | null;
    successMsg: string | null;
    targetCustomerId : number | null;
    filterError: string | null;
    customer: LinkedCustomer | null;
  }

const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: null,
    successMsg: null,
    targetCustomerId : null,
    filterError: null,
    customer: null
  };

  export const fetchCustomers = createAsyncThunk(
    'customer/fetchCustomers',
    async (_, { getState, rejectWithValue }) => {
      const token = (getState() as RootState).login.token;
      if (!token) return rejectWithValue('No token');
      try {
        const response = await getAllCustomersService(token);
        console.log(response);
        return response;
      } catch (err: any) {
        console.log(err);
        return rejectWithValue(err.response.data.error);
      }
    }
  );

  export const removeCustomer = createAsyncThunk<
  { message: string }, 
  number,                              
  { state: RootState; rejectValue: string }
>(
  'customer/removeCustomer',
  async (customerId, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token available.');

    try {
      const result = await removeCustomerService(customerId, token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Customer removal failed.');
    }
  }
);

export const getCustomerByUsername = createAsyncThunk<
  any,
  string,
  { state: RootState }
>(
  'customer/getCustomerByUsername',
  async (username, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token');
    try {
      const result = await getCustomerByUsernameService(username, token);
      console.log(result);
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || 'Failed to fetch customer';
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateCustomer = createAsyncThunk<
  any, 
  any, 
  { state: RootState }
>(
  'customer/updateCustomer',
  async (formData, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No token provided');
    try {
      const result = await updateCustomerService(formData, token);
      return result;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.error || 'Update failed');
    }
  }
);

export const getCustomerByUserId = createAsyncThunk<
  LinkedCustomer,
  string,
  { rejectValue: string }
>('customer/getCustomerByUserId', async (token, { rejectWithValue }) => {
  try {
    const customer = await getCustomerByUserIdService(token);
    return customer;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch customer data');
  }
});

  const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
      clearCustomerState: (state) => {
        state.customers = [];
        state.loading = false;
        state.error = null;
        state.successMsg = null;
        state.targetCustomerId = null;
        state.filterError = null;
        state.customer = null
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
          state.loading = false;
        })
        .addCase(fetchCustomers.rejected, (state, action) => {
          state.loading = false;
          state.filterError = action.payload as string;
          state.error = null;
          console.log(state.filterError);
          
        })
        .addCase(removeCustomer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(removeCustomer.fulfilled, (state, action) => {
          state.loading = false;
          state.successMsg = action.payload.message as string;
          state.error = null;
          state.filterError = null;
        })
        .addCase(removeCustomer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || action.error.message || 'Removal failed';
          console.log("THE ERROR IS ", state.error);
          
          state.filterError = null;
        })
        .addCase(getCustomerByUsername.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getCustomerByUsername.fulfilled, (state, action) => {
          state.loading = false;
          state.customers = Array.isArray(action.payload) ? action.payload : [action.payload];
        })
        .addCase(getCustomerByUsername.rejected, (state, action) => {
          state.loading = false;
          state.error = null;
          state.filterError = action.payload as string;
        })
        .addCase(updateCustomer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCustomer.fulfilled, (state, action) => {
          state.loading = false;
          state.successMsg = action.payload.message as string;
          state.error = null
        })
        .addCase(updateCustomer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          state.successMsg = null
        })
        .addCase(getCustomerByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(getCustomerByUserId.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
      })
      .addCase(getCustomerByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
    },
  });

  export default customersSlice.reducer;
  export const selectCustomerState = (state: RootState) => state.customer
  export const { clearCustomerState, setTargetCustomerId} = customersSlice.actions;
  