export interface File {
  id: string;
  name: string;
  uploadedAt: Date;
  size: string;
  type: string;
  shared?: boolean;
}

export interface FileListProps {
  files: File[];
  onDelete: (fileId: string) => void;
  onShare: (fileId: string) => void;
}
