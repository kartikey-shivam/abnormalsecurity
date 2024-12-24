import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/app/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";

interface MFASetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const MFASetup = ({ onComplete, onCancel }: MFASetupProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"generate" | "verify">("generate");

  const generateMFA = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/mfa/generate");
      setQrCode(response.data.qrCode);
      setStep("verify");
    } catch (error) {
      toast.error("Failed to generate MFA");
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/mfa/verify", { code: verificationCode });
      toast.success("MFA setup complete");
      onComplete();
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Setup Two-Factor Authentication
      </h2>

      {step === "generate" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Enhance your account security by setting up two-factor
            authentication.
          </p>
          <button
            onClick={generateMFA}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : "Generate QR Code"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
          >
            Skip for now
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <div className="flex justify-center">
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code"
                className="w-48 h-48 border rounded p-2"
              />
            )}
          </div>
          <p className="text-sm text-gray-600">
            1. Install Google Authenticator or any TOTP app
            <br />
            2. Scan the QR code or enter the key manually
            <br />
            3. Enter the verification code shown in your app
          </p>
          <form onSubmit={verifyMFA} className="space-y-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner /> : "Verify Code"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
