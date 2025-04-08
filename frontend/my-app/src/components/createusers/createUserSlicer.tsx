import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CreateUserService from './CreateUserService'
import customerSignUpService from './CreateUserService';

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
        const response = await customerSignUpService(customerData); ////////////////////////
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
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
        state.successMessage = action.payload;
        state.error = null
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Register failed';
        console.log(action.error.message)
      });
    },
  });

export default UserSlicer.reducer;
export const selectUserLoading = (state: { user: { loading: boolean } }) => state.user.loading;
export const selectUserError = (state: { user: { error: string | null } }) => state.user.error;
export const selectUserSucMsg = (state: { user: { successMessage: string | null } }) => state.user.successMessage;




