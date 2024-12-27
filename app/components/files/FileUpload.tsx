"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { uploadFile } from '@/app/features/files/fileSlice';
import { toast } from 'react-hot-toast';
import { AppDispatch } from '@/app/store/store';
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const FileUpload = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await dispatch(uploadFile(formData)).unwrap();
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop the file here"
              : "Drag and drop a file here, or click to select a file"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
