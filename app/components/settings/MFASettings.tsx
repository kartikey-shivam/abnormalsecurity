"use client";

import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-hot-toast";
import api from "@/app/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/app/features/auth/authSlice";

interface MFASettingsProps {
  is_mfa_enabled: boolean;
}

export const MFASettings = ({
  is_mfa_enabled: initialMfaState,
}: MFASettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(initialMfaState);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const handleMFAToggle = async () => {
    if (isMfaEnabled) {
      // Handle disable
      await handleDisableMFA();
    } else {
      // Handle enable
      await handleEnableMFA();
    }
  };

  const handleEnableMFA = async () => {
    setLoading(true);
    try {
      // First, initiate MFA setup
      const setupResponse = await api.post("/auth/setup-mfa/");
      setQrCode(setupResponse.data.setup_token);
      setShowVerification(true);
    } catch (error) {
      toast.error("Failed to initiate MFA setup");
      console.error("MFA setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      // First verify the setup
      await api.post("/auth/verify-mfa/", {
        mfa_code: verificationCode,
      });

      // Then enable MFA
      await api.post("/auth/enable-mfa/", {
        enable: true,
      });

      setIsMfaEnabled(true);
      setShowVerification(false);
      setQrCode(null);
      toast.success("MFA enabled successfully");

      // Update user info in Redux
      dispatch(setUser({ ...user, is_mfa_enabled: true }));
    } catch (error) {
      toast.error("Failed to verify MFA code");
      console.error("MFA verification error:", error);
    } finally {
      setLoading(false);
      setVerificationCode("");
    }
  };

  const handleDisableMFA = async () => {
    setLoading(true);
    try {
      await api.post("/auth/enable-mfa/", {
        enable: false,
      });
      setIsMfaEnabled(false);
      toast.success("MFA disabled successfully");

      // Update user info in Redux
      dispatch(setUser({ ...user, is_mfa_enabled: false }));
    } catch (error) {
      toast.error("Failed to disable MFA");
      console.error("MFA disable error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
          <p className="text-gray-600 text-sm mt-1">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch
          checked={isMfaEnabled}
          onChange={handleMFAToggle}
          disabled={loading || showVerification}
          className={`${
            isMfaEnabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner className="h-4 w-4" />
            </div>
          )}
          <span
            className={`${
              isMfaEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {showVerification && qrCode && (
        <div className="mt-6 space-y-4">
          <p className="text-gray-600">
            Scan this QR code with your authenticator app:
          </p>
          <div className="flex justify-center">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="Enter 6-digit code"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              maxLength={6}
            />
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleVerifyAndEnable}
                disabled={loading || verificationCode.length !== 6}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : "Verify & Enable"}
              </button>
              <button
                onClick={() => {
                  setShowVerification(false);
                  setQrCode(null);
                  setVerificationCode("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        {isMfaEnabled
          ? "Two-factor authentication is currently enabled."
          : "Enable two-factor authentication for enhanced security."}
      </div>
    </div>
  );
};
