import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import api from "./api";

interface DecodedToken {
  user_id: number;
  exp: number;
}

interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  is_mfa_enabled: boolean;
}

export const getUserFromToken = () => {
  const accessToken = Cookies.get("access_token");
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    return { ...decoded, token: accessToken };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const fetchUserInfo = async (
  userId: number,
  token: string
): Promise<UserInfo> => {
  try {
    const response = await api.get(`/auth/user-info/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  const tokenData = getUserFromToken();
  if (!tokenData) return null;

  try {
    return await fetchUserInfo(tokenData.user_id, tokenData.token);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
