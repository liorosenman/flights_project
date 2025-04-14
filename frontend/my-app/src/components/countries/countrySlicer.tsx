import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCountries } from './countryService.tsx';
import {Country} from '../../models/country.ts'

interface CreateUserState {
    countries : Country[]
    error: string | null;
    loading: boolean;
  }
  
const initialState: CreateUserState = {
  countries : [],
  error : null,
  loading: false,

};

export const fetchCountries = createAsyncThunk<Country[], void>(
  'country/fetchCountries',
  async (_, thunkAPI) => {
    try {
      const response = await getAllCountries();
      return response.data.countries as Country[];
      
      
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
    .addCase(fetchCountries.fulfilled, (state, action) => {
      state.loading = false;
      state.countries = action.payload;
    })
    .addCase(fetchCountries.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
  }
});

export default CountrySlicer.reducer;