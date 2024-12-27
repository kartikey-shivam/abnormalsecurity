"use client";

import { useSelector } from "react-redux";
import { MFASettings } from "./MFASettings";
import { UserRoleManagement } from "./UserRoleManagement";
import { RootState } from "@/app/store/store";

export const Settings = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <div className="flex justify-between items-center p-6 bg-white border-b">
        <h1 className="text-2xl font-bold  text-black">Settings</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow">
          <MFASettings is_mfa_enabled={user?.is_mfa_enabled || false} />
        </div>

        {user?.role === "admin" && <UserRoleManagement />}
      </div>
    </div>
  );
};
