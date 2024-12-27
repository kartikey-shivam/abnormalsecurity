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
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  fetchSharedWithMe,
  fetchMyShares,
} from "@/app/features/files/fileSlice";
import { fetchAdminShares, revokeShare, downloadSharedFile } from "@/app/features/admin/adminSlice";
import { AdminSharedFiles } from "../admin/AdminSharedFiles";
import { toast } from "react-hot-toast";
import { SharedWithMeFile } from "@/app/types/file";

export const SharedFiles = () => {
  const [activeTab, setActiveTab] = useState<"received" | "shared" | "admin">("received");
  const dispatch = useDispatch<AppDispatch>();
  const { sharedWithMe, myShares, loading } = useSelector(
    (state: RootState) => state.files
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin'; // Adjust according to your user role structure

  useEffect(() => {
    if (activeTab === "received") {
      dispatch(fetchSharedWithMe());
    } else if (activeTab === "shared") {
      dispatch(fetchMyShares());
    } 
    // else if (activeTab === "admin" && isAdmin) {
    //   dispatch(fetchAdminShares());
    // }
  }, [dispatch, activeTab, isAdmin]);

  const renderPermissionIcons = (permission: "view" | "download") => (
    <div className="flex space-x-2">
      <EyeIcon className="h-5 w-5 text-gray-500" />
      {permission === "download" && (
        <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
      )}
    </div>
  );

  const handleDelete = async (shareId: number) => {
    try {
      await dispatch(revokeShare(shareId)).unwrap();
      // Refresh the list after deletion
      if (activeTab === "received") {
        dispatch(fetchSharedWithMe());
      } else if (activeTab === "shared") {
        dispatch(fetchMyShares());
      }
      toast.success("Share access revoked");
    } catch (error) {
      toast.error("Failed to revoke share access");
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      await dispatch(downloadSharedFile({ fileId, fileName })).unwrap();
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const canDownload = (file: SharedWithMeFile) => {
    return isAdmin || file.is_public || file.permission === "download";
  };

  const canDelete = (file: SharedWithMeFile) => {
    return isAdmin || file.shared_by === user?.email;
  };

  const handleFileClick = (fileId: number) => {
    // Open file in new tab using the view API endpoint
    window.open(`/files/${fileId}/view/`, '_blank');
  };

  const renderSharedWithMeList = () => (
    <div className="space-y-4">
      {sharedWithMe.map((file) => (
        <div
          key={file.file_id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 
              onClick={() => handleFileClick(file.file_id)}
              className="font-medium text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              {file.filename}
            </h3>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Shared by: {file.shared_by}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>Expires: {new Date(file.expires_at).toLocaleDateString()}</span>
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
            {user ? ( // Only show action buttons for logged-in users
              <div className="flex space-x-2">
                {canDownload(file) && (
                  <button
                    onClick={() => handleDownload(file.file_id, file.filename)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                    title="Download file"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                )}
                {canDelete(file) && (
                  <button
                    onClick={() => handleDelete(file.file_id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                    title="Delete share"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              // For guest users, only show view icon
              <div className="flex space-x-2">
                <EyeIcon className="h-5 w-5 text-gray-400" />
              </div>
            )}
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
            <h3 
              onClick={() => handleFileClick(file.file_id)}
              className="font-medium text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              {file.filename}
            </h3>
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
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(file.file_id, file.filename)}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                title="Download file"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(file.file_id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Delete share"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
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
            {/* {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`${
                  activeTab === "admin"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All Shares (Admin)
              </button>
            )} */}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="mt-6">
          {activeTab === "received" && renderSharedWithMeList()}
          {activeTab === "shared" && renderMySharesList()}
        </div>
      )}
    </div>
  );
};
