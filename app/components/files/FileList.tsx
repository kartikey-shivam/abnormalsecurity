import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DocumentIcon,
  ShareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { File, FileListProps } from "../../types/file";
import { downloadFile } from "@/app/utils/fileHelpers";
import { deleteFile, shareFile } from "@/app/features/files/fileSlice";
import { toast } from "react-hot-toast";
import type { AppDispatch } from "@/app/store/store";
import { ShareDialog } from "./ShareDialog";

const FileList: React.FC<FileListProps> = ({ files }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const handleDelete = async (fileId: number) => {
    try {
      setDeletingId(fileId);
      await dispatch(deleteFile(fileId)).unwrap();
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.message || "Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShareClick = (fileId: number) => {
    setSelectedFileId(fileId);
    setShareDialogOpen(true);
  };

  const handleShare = async (shareData: {
    share_type: "public" | "private";
    permission: "view" | "download";
    expires_in_days: number;
    users?: string[];
  }) => {
    if (!selectedFileId) return;

    try {
      await dispatch(shareFile({
        fileId: selectedFileId,
        shareData
      })).unwrap();
      toast.success("File shared successfully");
      setShareDialogOpen(false);
    } catch (error: any) {
      console.error("Share error:", error);
      toast.error(error?.message || "Failed to share file");
    }
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentIcon className="h-6 w-6 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600 font-semibold cursor-pointer">
                        {file.original_filename}
                      </p>
                      <div className="flex text-sm text-gray-500 space-x-4">
                        <span>
                          Uploaded{" "}
                          {new Date(file.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadFile(file.id.toString(), file.original_filename)}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50"
                      title="Download file"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShareClick(file.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Share file"
                      disabled={deletingId === file.id}
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file.id)}
                      className={`p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 ${
                        deletingId === file.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete file"
                      disabled={deletingId === file.id}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedFileId(null);
        }}
        onShare={handleShare}
      />
    </>
  );
};

export default FileList;
