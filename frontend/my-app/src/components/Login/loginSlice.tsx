import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { loginRequest, logoutUser } from './loginService.tsx';
import axios from 'axios';
import { UserToken } from '../../models/UserToken.ts';
import { AppDispatch, RootState } from '../../app/store.ts';
import {jwtDecode} from 'jwt-decode';
import { useAppDispatch } from '../../app/hooks.ts';

const accessToken = localStorage.getItem('access_token');
let roleId = null;
let userId = null;

interface LoginState {
  token: string | null;
  refreshToken: string | null;
  roleId: number | null;
  userId: number | null;
  error: string | null;
  loading: boolean;
}

const initialState: LoginState = {
  token: accessToken,
  refreshToken: localStorage.getItem('refresh_token'),
  roleId: roleId,
  userId: userId,
  error: null,
  loading: false,
};

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }: { username: string; password: string }, 
    {dispatch, rejectWithValue}
    ) => {
      try
      {
      const result = await loginRequest(username, password);
      if (result.error) {
        return rejectWithValue(result.error)
      }
      // dispatch(setAuthTokens(result));
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      console.log(result);
      // localStorage.setItem("acc")
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
    const state = getState() as { auth: LoginState };
    const refreshToken = state.auth.refreshToken;
    
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
        console.log("DDDDDDDDDDDDDDD");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        loginSlice.actions.clearAuthTokens();  
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
    justPrint: () => {
      console.log("HHHHHHHHHHHHHHHHHHHHHHH");
      
    },
  //   setAuthTokens: (state, action) => {
  //     const token = action.payload?.access || null;
  //     const refreshToken = action.payload?.refresh || null;
  //     state.token = token;
  //     console.log(state.token);
  //     console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJ");
      
  //     state.refreshToken = refreshToken;
  //     if (token) {
  //       try {
  //         const decoded: any = jwtDecode(token);
  //         state.roleId = decoded.role_id || null;
  //         state.userId = decoded.id || null;
  //       } catch (error) {
  //         console.error("Failed to decode token:", error);
  //         state.roleId = null;
  //         state.userId = null;
  //       }
  //     } else {
  //       state.roleId = null;
  //       state.userId = null;
  //     }
  //   },
    clearAuthTokens: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.roleId = null;
      state.userId = null;
    }},
    
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = ""
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload?.token || null;
        state.token = token;
        state.loading = false;
        state.error = null;
      
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            console.log(decoded);
            
            state.roleId = decoded.role_id || null;
            state.userId = decoded.id || null;
      
            // Store to localStorage if needed
            localStorage.setItem('access_token', token);
          } catch (error) {
            console.error("Failed to decode token:", error);
            state.roleId = null;
            state.userId = null;
          }
        } else {
          state.roleId = null;
          state.userId = null;
        }
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
        state.roleId = null;
        state.userId = null;
        console.log("LLLLLLLLLLOGEDOUT");
        
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default loginSlice.reducer;
export const selectLoginState = (state: RootState) => state.login;
export const { clearAuthTokens } = loginSlice.actions;
export const selectUserRoleId = (state: RootState) => state.login.roleId;
