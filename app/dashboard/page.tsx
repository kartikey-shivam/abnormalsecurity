"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/layout/Layout";
import FileUpload from "../components/files/FileUpload";
import FileList from "../components/files/FileList";
import { File } from "../types/file";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchFiles } from "../features/files/fileSlice";
import type { AppDispatch } from "../store/store";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { files } = useSelector((state: RootState) => state.files);

  // Add debug log to check files
  useEffect(() => {
    console.log("Current files:", files);
  }, [files]);

  const handleFileShare = async (fileId: number) => {
    router.push(`/share/${fileId}`);
  };

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

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
          <FileList files={files} />
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
