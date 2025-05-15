import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {adminSignupService, customerSignUpService} from './CreateUserService.tsx';
import {airlineSignupService} from './CreateUserService.tsx';
import { RootState } from '../../app/store';
import { clearMessages } from '../users/airline/airlineSlicer.tsx';

interface CreateUserState {
    error: string | null;
    loading: boolean;
    successMessage: string | null;
  }
  
const initialState: CreateUserState = {
  error : null,
  loading: false,
  successMessage: null

};


export const createCustomer = createAsyncThunk<string, Record<string, any>>(
    'user/createCustomer',
    async (customerData, { rejectWithValue }) => {
      try {
        const response = await customerSignUpService(customerData);
        return response.data.message;
      } catch (error:any) { 
        return rejectWithValue(error.response?.data?.error  || 'Unknown error');
      }
    }
  );

  export const createAirline = createAsyncThunk<string, Record<string, any>>(
    'user/createAirline',
    async (airlineData, { rejectWithValue }) => {
      try {
        const response = await airlineSignupService(airlineData);
        return response.data.message;
      } catch (error:any) { 
        return rejectWithValue(error.response?.data?.error || 'Unknown error');
      }
    }
  );

  export const createAdmin = createAsyncThunk<string, Record<string, any>>(
    'user/createAdmin',
    async (adminData, { rejectWithValue }) => {
      try {
        const response = await adminSignupService(adminData);
        return response.data.message;
      } catch (error:any) { 
        return rejectWithValue(error.response?.data?.error || 'Unknown error');
      }
    }
  );

  const UserSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearRegisterResponses: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string
        state.error = null
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message  ||'Register failed';
        state.successMessage = null;
      })
      .addCase(createAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string
        state.error = null
      })
      .addCase(createAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message  ||'Register failed';
        state.successMessage = null;
      })
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string
        state.error = null
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message  ||'Register failed';
        state.successMessage = null
      }); 
    },
  });

export default UserSlicer.reducer;
export const selectUserState = (state: RootState) => state.user;
export const { clearRegisterResponses } = UserSlicer.actions;


