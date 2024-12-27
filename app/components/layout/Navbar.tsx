"use client";

import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../auth/LogoutButton";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_mfa_enabled: boolean;
}

interface AuthState {
  user: User | null;
}

const Navbar: React.FC = () => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  return (
    <nav className="bg-white shadow-lg h-[8%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">
                SecureShare
              </span>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {user.role}
                </span>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
