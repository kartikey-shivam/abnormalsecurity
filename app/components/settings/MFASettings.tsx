"use client";

import React, { useState, useEffect } from "react";
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
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  // Check MFA status on component mount
  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const response = await api.get("/mfa/mfa_status/");
      setIsMfaEnabled(response.data.mfa_enabled);
      dispatch(setUser({ ...user, is_mfa_enabled: response.data.mfa_enabled }));
    } catch (error) {
      console.error("Failed to check MFA status:", error);
    }
  };

  const handleMFAToggle = async () => {
    if (isMfaEnabled) {
      await handleDisableMFA();
    } else {
      await handleEnableMFA();
    }
  };

  const handleEnableMFA = async () => {
    setLoading(true);
    try {
      const response = await api.post("/mfa/setup_mfa/");
      setUserEmail(response.data.email);
      setShowVerification(true);
      toast.success("Verification code sent to your email");
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
      await api.post("/mfa/verify_mfa/", {
        code: verificationCode
      });

      setIsMfaEnabled(true);
      setShowVerification(false);
      toast.success("MFA enabled successfully");
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
      await api.post("/mfa/disable_mfa/");
      setIsMfaEnabled(false);
      toast.success("MFA disabled successfully");
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
          <h2 className="text-xl font-semibold text-black">Two-Factor Authentication</h2>
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
          <span
            className={`${
              isMfaEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {showVerification && (
        <div className="mt-6 space-y-4">
          <p className="text-gray-600">
            A verification code has been sent to {userEmail}
          </p>
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="mt-2 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
