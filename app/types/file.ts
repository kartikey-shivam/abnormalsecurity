export interface File {
  id: number;
  original_filename: string;
  uploaded_at: string;
}

export interface FileListProps {
  files: File[];
}

export interface SharedWithMeFile {
  file_id: number;
  filename: string;
  shared_by: string;
  shared_at: string;
  expires_at: string;
  permission: "view" | "download";
  is_public: boolean;
}

export interface MySharedFile {
  file_id: number;
  filename: string;
  created_at: string;
  expires_at: string;
  permission: "view" | "download";
  is_public: boolean;
  is_expired: boolean;
  shared_with?: string;
}

export interface AdminShare {
  id: number;
  file_name: string;
  shared_by: string;
  shared_with: string[];
  created_at: string;
  expires_at: string;
  is_public: boolean;
  permission: 'view' | 'download';
  file_id: number;
}
