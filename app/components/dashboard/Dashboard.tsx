"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import FileUpload from "../files/FileUpload";
import FileList from "../files/FileList";
import {
  fetchFiles,
  deleteFile,
  shareFile,
} from "@/app/features/files/fileSlice";
import { toast } from "react-hot-toast";
import { ShareDialog } from "../files/ShareDialog";

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files, loading } = useSelector((state: RootState) => state.files);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleDelete = async (fileId: number) => {
    try {
      await dispatch(deleteFile(fileId)).unwrap();
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleShare = async (fileId: number) => {
    setSelectedFileId(fileId);
    setShareDialogOpen(true);
  };

  const handleShareSubmit = async (shareData: {
    share_type: "public" | "private";
    permission: "view" | "download";
    expires_in_days: number;
    users?: string[];
  }) => {
    try {
      if (selectedFileId) {
        await dispatch(
          shareFile({
            fileId: selectedFileId,
            shareData,
          })
        ).unwrap();
        toast.success("File shared successfully");
        setShareDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to share file");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-6 bg-white border-b">
        <h1 className="text-2xl font-bold">My Files</h1>
        <button
          onClick={() => dispatch(fetchFiles())}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="p-6">
        <FileUpload />
        {loading ? (
          <div className="text-center mt-8">Loading files...</div>
        ) : (
          <div className="mt-8">
            <FileList
              files={files}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          </div>
        )}
      </div>
      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        onShare={handleShareSubmit}
      />
    </div>
  );
};
