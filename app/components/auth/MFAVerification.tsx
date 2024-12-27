"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/app/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User } from "@/app/types";
import Cookies from "js-cookie";
import { fetchUserInfo } from "@/app/utils/user";

interface MFAVerificationProps {
  tempToken: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

interface DecodedToken {
  user_id: string | number;
  exp: number;
}

export const MFAVerification = ({
  tempToken,
  onCancel,
  onSuccess,
}: MFAVerificationProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        mfa_code: code,
      };

      const response = await api.post("/auth/verify-mfa/", payload, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Wait briefly for cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const accessToken = Cookies.get("access_token");
      console.log("Cookies available:", document.cookie);
      console.log("Access Token:", accessToken);

      if (!accessToken) {
        toast.error("Verification failed - No access token received");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(accessToken);
        const userInfo = await fetchUserInfo(
          Number(decoded.user_id),
          accessToken
        );
        dispatch(setUser(userInfo));
        toast.success("MFA verification successful");

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error processing user info:", error);
        toast.error("Failed to process user information");
      }
    } catch (error: any) {
      console.error("MFA verification error:", error.response?.data);
      if (error.response?.status === 401) {
        toast.error("Invalid verification code");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.detail || "Invalid code format");
      } else {
        toast.error("Verification failed. Please try again.");
      }
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600 text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <div className="flex justify-center mb-4">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                className="block text-black w-48 text-center text-3xl tracking-widest py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                pattern="[0-9]{6}"
                maxLength={6}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mb-6">
              Open your authenticator app to view your code
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : "Verify"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={onCancel}
            className="text-blue-600 hover:text-blue-500"
          >
            Try a different login method
          </button>
        </div>
      </div>
    </div>
  );
};
