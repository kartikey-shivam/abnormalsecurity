export type UserRole = "admin" | "regular" | "guest";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_mfa_enabled: boolean;
  // ... other user properties
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
