"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  fetchSharedWithMe,
  fetchMyShares,
} from "@/app/features/files/fileSlice";

export const SharedFiles = () => {
  const [activeTab, setActiveTab] = useState<"received" | "shared">("received");
  const dispatch = useDispatch<AppDispatch>();
  const { sharedWithMe, myShares, loading } = useSelector(
    (state: RootState) => state.files
  );

  useEffect(() => {
    if (activeTab === "received") {
      dispatch(fetchSharedWithMe());
    } else {
      dispatch(fetchMyShares());
    }
  }, [dispatch, activeTab]);

  const renderPermissionIcons = (permission: "view" | "download") => (
    <div className="flex space-x-2">
      <EyeIcon className="h-5 w-5 text-gray-500" />
      {permission === "download" && (
        <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
      )}
    </div>
  );

  const renderSharedWithMeList = () => (
    <div className="space-y-4">
      {sharedWithMe.map((file) => (
        <div
          key={file.file_id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 className="font-medium">{file.filename}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Shared by: {file.shared_by}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Expires: {new Date(file.expires_at).toLocaleDateString()}
                </span>
              </div>
              {file.is_public && (
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>Public share</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {renderPermissionIcons(file.permission)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMySharesList = () => (
    <div className="space-y-4">
      {myShares.map((file) => (
        <div
          key={file.file_id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 className="font-medium">{file.filename}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              {file.shared_with && (
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Shared with: {file.shared_with}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Expires: {new Date(file.expires_at).toLocaleDateString()}
                  {file.is_expired && " (Expired)"}
                </span>
              </div>
              {file.is_public && (
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>Public share</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {renderPermissionIcons(file.permission)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("received")}
              className={`${
                activeTab === "received"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Shared with Me
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`${
                activeTab === "shared"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Shares
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="mt-6">
          {activeTab === "received"
            ? renderSharedWithMeList()
            : renderMySharesList()}
        </div>
      )}
    </div>
  );
};
