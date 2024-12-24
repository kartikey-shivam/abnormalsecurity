"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/layout/Layout";
import FileUpload from "../components/files/FileUpload";
import FileList from "../components/files/FileList";
import { File } from "../types/file";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();

  // Example files data - replace with actual data from your API/Redux store
  const files: File[] = [
    {
      id: "1",
      name: "document.pdf",
      uploadedAt: new Date(),
      size: "2.5MB",
      type: "application/pdf",
    },
    {
      id: "2",
      name: "image.jpg",
      uploadedAt: new Date(),
      size: "1.2MB",
      type: "image/jpeg",
      shared: true,
    },
  ];

  const handleFileDelete = useCallback(async (fileId: string) => {
    try {
      await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      toast.success("File deleted successfully");
      // Add Redux action to refresh files
    } catch (error) {
      toast.error("Failed to delete file");
      console.error("Failed to delete file:", error);
    }
  }, []);

  const handleFileShare = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/share`, {
        method: "POST",
      });
      const { shareUrl } = await response.json();
      // Handle share URL (e.g., copy to clipboard)
    } catch (error) {
      console.error("Failed to share file:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Files
            </h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // Handle refresh or other actions
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <FileUpload />
          </div>
        </div>

        <div className="mt-8">
          <FileList
            files={files}
            onDelete={handleFileDelete}
            onShare={handleFileShare}
          />
        </div>

        {files.length === 0 && (
          <div className="text-center mt-8">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No files uploaded
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first file.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
