"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/app/features/auth/authSlice";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    try {
      // Remove the access token cookie
      Cookies.remove("access_token", {
        path: "/",
        domain: "localhost",
      });

      // Dispatch logout action to clear Redux state
      dispatch(logout());

      // Show success message (optional)
      toast.success("Logged out successfully");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
