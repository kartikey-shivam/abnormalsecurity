import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_mfa_enabled: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  mfaEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  mfaEnabled: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.mfaEnabled = action.payload.is_mfa_enabled;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.mfaEnabled = false;
      Cookies.remove("access_token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
