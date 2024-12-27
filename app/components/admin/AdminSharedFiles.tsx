import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  TrashIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '@/app/store/store';
import { fetchAdminShares, revokeShare, downloadSharedFile } from '@/app/features/admin/adminSlice';
import { toast } from 'react-hot-toast';
import { AdminShare } from '@/app/types/file';

export const AdminSharedFiles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [selectedShare, setSelectedShare] = useState<number | null>(null);

  const { adminShares } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    loadShares();
  }, [dispatch]);

  const loadShares = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAdminShares()).unwrap();
    } catch (error) {
      toast.error('Failed to load shared files');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (shareId: number) => {
    try {
      setSelectedShare(shareId);
      await dispatch(revokeShare(shareId)).unwrap();
    } catch (error) {
      toast.error('Failed to revoke share access');
    } finally {
      setSelectedShare(null);
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      await dispatch(downloadSharedFile({ fileId, fileName })).unwrap();
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Shared Files</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all shared files across the platform
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      File Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Shared By
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Shared With
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Permissions
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {adminShares.map((share: AdminShare) => (
                    <tr key={share.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {share.file_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {share.shared_by}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {share.is_public ? (
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="ml-1">
                            {share.is_public ? 'Public' : `${share.shared_with.length} users`}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(share.expires_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                          {share.permission === 'download' && (
                            <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDownload(share.file_id, share.file_name)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleRevoke(share.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={selectedShare === share.id}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 