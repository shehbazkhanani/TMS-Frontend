import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { message } from 'antd';

export interface IUser {
  id: string;
}

interface AuthState {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  user: IUser | null;
  messages: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  email: null,
  isLoading: false,
  error: null,
  user: null,
  messages: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (user: any, thunkAPI) => {
    try {
      const response = await api.post('/login', user);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (user: any, thunkAPI) => {
    try {
      const response = await api.post('/create_user', user);
      return response.data;
    } catch (error: any) {
      message.error(error.response.data.message)
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.access_token;
        state.user = { id: action.payload.user_id };
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to log in';
        state.isAuthenticated = false;
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.messages = "Sign in Successfully"
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
