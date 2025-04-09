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
        console.log(response);
        return response.data;
      } catch (error:any) { // was without :any
        // return rejectWithValue(error.response.data);
        return rejectWithValue(error.response?.data?.error || 'Unknown error');
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
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
        state.loading = false;
        state.error = action.payload as string || action.error.message  ||'Register failed';

      });
    },
  });

export default UserSlicer.reducer;
export const selectUserLoading = (state: { user: { loading: boolean } }) => state.user.loading;
export const selectUserError = (state: { user: { error: string | null } }) => state.user.error;
export const selectUserSucMsg = (state: { user: { successMessage: string | null } }) => state.user.successMessage;




