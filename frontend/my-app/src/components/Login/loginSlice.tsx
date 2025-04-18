import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, logoutUser } from './loginService.tsx';
import axios from 'axios';
import { UserToken } from '../../models/UserToken.ts';
import { AppDispatch, RootState } from '../../app/store.ts';
// import { UserToken } from '../../models/UserToken.ts';

interface LoginState {
  token : any | null;
  refreshToken: string | null;
  error: string | null;
  loading: boolean;
  // error: string | null;
}

const initialState: LoginState = {
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  error : null,
  loading: false,
}

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }: { username: string; password: string }, 
    {rejectWithValue}
   ) => {
    try
    {
    const result = await loginRequest(username, password);
    if (result.error) {
      return rejectWithValue(result.error)
    }
    console.log(result);
    
    return result
  }catch (error:any){
    return rejectWithValue(error.message || 'Unexpected error occurred');
  }
  }
);

// export const loginUser = createAsyncThunk<
//   void,
//   { username: string; password: string },
//   { dispatch: AppDispatch }
// >('auth/login', async ({ username, password }, { dispatch, rejectWithValue }) => {
//   try {
//     const response = await loginRequest(username, password); // your API call

//     const { access, refresh } = response;

//     // Save to localStorage
//     localStorage.setItem('access_token', access);
//     localStorage.setItem('refresh_token', refresh);

//     // ✅ Save to Redux
//     dispatch(setAuthTokens({ access, refresh }));
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.error || 'Login failed');
//   }
// });


export const logout = createAsyncThunk<void, void>(
  'login/logout',
  async (_, { getState, rejectWithValue }) => {
    // ⬇️ access the refreshToken directly
    const state = getState() as { auth: LoginState };
    const refreshToken = state.auth.refreshToken;

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        state.auth.token = null
        state.auth.refreshToken = null
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);


const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setAuthTokens: (state, action) => {
      state.token = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = ""
      })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token
          
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed';
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default loginSlice.reducer;
export const selectLoginState = (state: RootState) => state.login;
