// airlineSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LinkedAirline } from '../../../models/LinkedAirline';
import { LinkedCustomer } from '../../../models/LinkedCustomer';
import { LinkedAdmin } from '../../../models/LinkedAdmin';
import { getAllAirlinesService } from '../airline/airlineService';
import { RootState } from '../../../app/store';


export interface UserManager {
    airlines: LinkedAirline[];
    customers: LinkedCustomer[];
    admins: LinkedAdmin[];
    generalSucMsg: string | null;
    generalErrMsg: string | null;
    error: string | null;
    sucMsg: string | null;
    loading: boolean;
}

const initialState: UserManager = {
    airlines: [],
    customers: [],
    admins: [],
    generalSucMsg: null,
    generalErrMsg: null,
    error: null,
    sucMsg: null,
    loading: false
};


export const fetchAirlines = createAsyncThunk(
  'airlines/fetchAirlines',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllAirlinesService();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch airlines');
    }
  }
);

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirlines.fulfilled, (state, action: PayloadAction<LinkedAirline[]>) => {
        state.loading = false;
        state.airlines = action.payload;
        state.error = 'Airlines loaded successfully';
      })
      .addCase(fetchAirlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {  } = managerSlice.actions;
export const selectManageState = (state: RootState) => state.manager;
export default managerSlice.reducer;
