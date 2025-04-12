import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {customerSignUpService} from './CreateUserService.tsx';
import {airlineSignupService} from './CreateUserService.tsx';
import { RootState } from '../../app/store';

interface CreateUserState {
    user : any[] | null
    error: string | null;
    loading: boolean;
    successMessage: string | null;
  }
  
const initialState: CreateUserState = {
  user : null,
  error : null,
  loading: false,
  successMessage: null

};


export const createCustomer = createAsyncThunk<string, Record<string, any>>(
    'user/createCustomer',
    async (customerData, { rejectWithValue }) => {
      try {
        const response = await customerSignUpService(customerData);
        return response.data;
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
        console.log(response);
        return response.data // Deleted the .data
      } catch (error:any) { 
        return rejectWithValue(error.response?.data?.error || 'Unknown error');
        // return rejectWithValue(error.error || 'Unknown error');
      }
    }
  );



  const UserSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
      });  

    },
  });

export default UserSlicer.reducer;
// export const selectUserLoading = (state: { user: { loading: boolean } }) => state.user.loading;
// export const selectUserError = (state: { user: { error: string | null } }) => state.user.error;
// export const selectUserSucMsg = (state: { user: { successMessage: string | null } }) => state.user.successMessage;
export const selectUserState = (state: RootState) => state.user;



