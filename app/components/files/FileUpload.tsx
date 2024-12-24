import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { uploadFile } from "@/app/features/files/fileSlice";
import type { AppDispatch } from "@/app/store/store";

interface UploadProgressProps {
  progress: number;
}

const UploadProgress = ({ progress }: UploadProgressProps) => (
  <div className="mt-4">
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            Uploading
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-blue-600">
            {progress}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
        />
      </div>
    </div>
  </div>
);

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      // Show upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      await dispatch(uploadFile(formData)).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB max file size
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/zip": [".zip"],
    },
  });

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isDragActive ? "Drop the file here" : "Upload a file"}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Supported files: PDF, DOC, DOCX, Images, ZIP (up to 100MB)
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Files are encrypted before upload for security
          </p>
        </div>

        {uploading && <UploadProgress progress={uploadProgress} />}
      </div>
    </div>
  );
};

export default FileUpload;
