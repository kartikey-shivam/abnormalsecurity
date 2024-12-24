import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/auth/authSlice";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("access_token") || Cookies.get("temp_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      console.log("Cookies after response:", document.cookie);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      Cookies.remove("access_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
