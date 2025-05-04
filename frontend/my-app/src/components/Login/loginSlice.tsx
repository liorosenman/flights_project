import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { loginRequest} from './loginService.tsx';
import { AppDispatch, RootState } from '../../app/store.ts';
import { jwtDecode } from 'jwt-decode';

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
  username: string | null
}

const initialState: LoginState = {
  token: accessToken,
  refreshToken: localStorage.getItem('refresh_token'),
  roleId: roleId,
  userId: userId,
  error: null,
  loading: false,
  username: null
};

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ username, password }: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const result = await loginRequest(username, password);
      if (result.error) {
        return rejectWithValue(result.error)
      }
      return result
    } catch (error: any) {
      return rejectWithValue(error.message || 'Unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'login/logout',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: LoginState };
    const refreshToken = state.auth.refreshToken;
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
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

    clearAuthTokens: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.roleId = null;
      state.userId = null;
    }
  },

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
            state.username = decoded.username || null;
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
