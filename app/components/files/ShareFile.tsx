// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '@/app/store/store';
// import { shareFile } from '@/app/features/files/fileSlice';
// import { toast } from 'react-hot-toast';

// interface ShareFileProps {
//   fileId: number;
//   onClose: () => void;
// }

// const ShareFile: React.FC<ShareFileProps> = ({ fileId, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [shareType, setShareType] = useState<'public' | 'private'>('private');
//   const [permission, setPermission] = useState<'view' | 'download'>('view');
//   const [expiresInDays, setExpiresInDays] = useState(7);
//   const [users, setUsers] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await dispatch(shareFile({
//         fileId,
//         shareData: {
//           share_type: shareType,
//           permission,
//           expires_in_days: expiresInDays,
//           users: shareType === 'private' ? users.split(',').map(email => email.trim()) : undefined
//         }
//       })).unwrap();
//       toast.success('File shared successfully');
//       onClose();
//     } catch (error) {
//       toast.error('Failed to share file');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Add form fields for sharing options */}
//     </form>
//   );
// };

// export default ShareFile; 