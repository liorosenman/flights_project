import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCountries } from './countryService.tsx';

interface CreateUserState {
    error: string | null;
    loading: boolean;
  }
  
const initialState: CreateUserState = {
  error : null,
  loading: false,

};

export const fetchCountries = createAsyncThunk(
  'country/fetchCountries',
  async (_, thunkAPI) => {
    try {
      const response = await getAllCountries();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || 'Unknown error'
      );
    }
  }
);

const CountrySlicer = createSlice({
name: 'country',
initialState,
reducers: {},
extraReducers: (builder) => {
  builder
    .addCase(fetchCountries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  }
});

export default CountrySlicer.reducer;