import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Define interfaces for the types
interface User {
  id: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  mfaRequired: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: any | null;
}

interface LoginResponse {
  token?: string;
  user?: User;
  mfaRequired?: boolean;
  tempToken?: string;
}

interface MFAVerifyData {
  tempToken: string;
  code: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  mfaRequired: false,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      if (response.data.mfaRequired) {
        return { mfaRequired: true, tempToken: response.data.tempToken };
      }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyMFA = createAsyncThunk(
  "auth/verifyMFA",
  async ({ tempToken, code }: MFAVerifyData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-mfa", { tempToken, code });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user || null;
          state.token = action.payload.token || null;
          state.isAuthenticated = true;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Similar patterns for login and verifyMFA
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
