export interface File {
  id: number;
  original_filename: string;
  uploaded_at: string;
  uploaded_by: number;
}

export interface FileListProps {
  files: File[];
  onDelete: (fileId: number) => void;
  onShare: (fileId: number) => void;
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
