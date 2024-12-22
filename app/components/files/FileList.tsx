import React from "react";
import {
  DocumentIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { File, FileListProps } from "../../types/file";

const FileList: React.FC<FileListProps> = ({ files, onDelete, onShare }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {files.map((file) => (
          <li key={file.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentIcon className="h-6 w-6 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <div className="flex text-sm text-gray-500 space-x-4">
                      <span>
                        Uploaded{" "}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                      <span>{file.size}</span>
                      {file.shared && (
                        <span className="text-blue-600">Shared</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onShare(file.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                    title="Share file"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                    title="Delete file"
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
  );
};

export default FileList;
