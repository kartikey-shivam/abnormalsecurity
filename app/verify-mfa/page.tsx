"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MFAVerification } from "../components/auth/MFAVerification";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export default function VerifyMFAPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tempToken, setTempToken] = useState<string | null>(null);

  useEffect(() => {
    // Get temp token from cookies
    const token = Cookies.get("temp_token");
    console.log("Temp token from cookie:", token);
    console.log("Cookies:", token);
    if (!token) {
      toast.error("Invalid verification session");
      router.replace("/login");
      return;
    }

    setTempToken(token);
    setIsLoading(false);
  }, [router]);

  if (isLoading || !tempToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading verification...</div>
      </div>
    );
  }

  return (
    <MFAVerification
      tempToken={tempToken}
      onCancel={() => {
        // Clean up temp token cookie when canceling
        Cookies.remove("temp_token", { path: "/", domain: "localhost" });
        router.replace("/login");
      }}
      onSuccess={() => {
        // Clean up temp token cookie on success
        Cookies.remove("temp_token", { path: "/", domain: "localhost" });
        router.replace("/dashboard");
      }}
    />
  );
}
