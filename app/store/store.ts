import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import fileReducer from "../features/files/fileSlice";
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
