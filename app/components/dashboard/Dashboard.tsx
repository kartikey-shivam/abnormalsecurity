"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import FileUpload from "../files/FileUpload";
import FileList from "../files/FileList";
import { LoadingSpinner } from "../LoadingSpinner";

interface DashboardProps {
  view: string;
}

export const Dashboard = ({ view }: DashboardProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { files, loading } = useSelector((state: RootState) => state.files);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {user?.role !== "guest" && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <FileUpload />
                </div>
              </div>
            )}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <FileList
                  files={files}
                  onDelete={(id) => {
                    /* handle delete */
                  }}
                  onShare={(id) => {
                    /* handle share */
                  }}
                />
                {files.length === 0 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      {user?.role === "guest"
                        ? "Guest users can only view shared files."
                        : "No files uploaded yet. Start by uploading your first file."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "shared":
        return (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Shared Files</h2>
              {/* Shared files content */}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Settings</h2>
              {/* Settings content */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  );
};
