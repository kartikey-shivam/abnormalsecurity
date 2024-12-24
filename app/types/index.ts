export type UserRole = "admin" | "regular" | "guest";

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: UserRole;
  mfaEnabled: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
