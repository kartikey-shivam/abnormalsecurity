"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/app/utils/user";
import { setUser } from "@/app/features/auth/authSlice";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Settings } from "../settings/Settings";
import { Dashboard } from "../dashboard/Dashboard";
import { SharedFiles } from "../shared/SharedFiles";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userInfo = await getCurrentUser();
        if (userInfo) {
          dispatch(setUser(userInfo));
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      }
    };

    initializeUser();
  }, [dispatch]);

  const renderContent = () => {
    switch (activeView) {
      case "settings":
        return <Settings />;
      case "dashboard":
        return <Dashboard view={activeView} />;
      case "shared":
        return <SharedFiles />;
      default:
        return children;
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <Navbar />
      <div className="flex h-[92%]">
        <Sidebar onNavigate={setActiveView} activeView={activeView} />
        <main className="flex-1 bg-gray-50 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Layout;
