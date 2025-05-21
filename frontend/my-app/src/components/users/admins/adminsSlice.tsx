import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store.ts';
import { getAdminByUsernameService, getAllAdminsService, removeAdminService } from './adminsService.tsx';
import { LinkedAdmin } from '../../../models/LinkedAdmin.ts';
import { logout } from '../../Login/loginSlice.tsx';

interface CustomerState {
  admins: LinkedAdmin[];
  loading: boolean;
  error: string | null;
  successMsg: string | null;
  targetAdminId: number | null;
  filterError: string | null;
}

const initialState: CustomerState = {
  admins: [],
  loading: false,
  error: null,
  successMsg: null,
  targetAdminId: null,
  filterError: null
};

export const fetchAdmins = createAsyncThunk(
  'admin/Admins',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).login.token;
    if (!token) return rejectWithValue('No token');
    try {
      return await getAllAdminsService(token);
    } catch (err: any) {
      return rejectWithValue(err.error);
    }
  }
);

export const removeAdmin = createAsyncThunk<
  { message: string },  
  number,                             
  { state: RootState; rejectValue: string }
>(
  'admin/removeAdmin',
  async (adminId, { getState, rejectWithValue }) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token available.');
    try {
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCC");
      const result = await removeAdminService(adminId, token);
      console.log(result);
      
      return result;
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Admin removal failed.';
      return rejectWithValue(errMsg);
    }
  }
);

export const getAdminByUsername = createAsyncThunk<
  any,
  string,
  { state: RootState }
>(
  'admins/getAdminByUsername',
  async (username, { getState, rejectWithValue }) => {
    const token = getState().login.token;
    if (!token) return rejectWithValue('No access token');

    try {
      const result = await getAdminByUsernameService(username, token);
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || 'Failed to fetch admin.';
      return rejectWithValue(errorMsg);
    }
  }
);

const adminSlicer = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminState: (state) => {
      state.admins = [];
      state.loading = false;
      state.error = null;
      state.filterError = null;
      state.successMsg = null;
      state.targetAdminId = null;
    },
    setTargetAdminId: (state, action) => {
      state.targetAdminId = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message as string;
      })
        .addCase(removeAdmin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string || action.error.message || 'Admin removal failure.';
          console.log(state.error);
      })
      
      .addCase(getAdminByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(getAdminByUsername.fulfilled, (state, action) => {
      state.loading = false;
      state.admins = [action.payload];
    })
    .addCase(getAdminByUsername.rejected, (state, action) => {
      state.loading = false;
      state.error = null;
      state.filterError = action.payload as string;
    });

},
  });

export default adminSlicer.reducer;
export const selectAdminState = (state: RootState) => state.admin
export const { clearAdminState, setTargetAdminId } = adminSlicer.actions;