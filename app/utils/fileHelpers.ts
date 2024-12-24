import { toast } from "react-hot-toast";
import api from "./api";

export const downloadFile = async (fileId: string, fileName: string) => {
  try {
    const response = await api.get(`/files/${fileId}/download/`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error: any) {
    console.error("Download failed:", error);
    toast.error("Failed to download file");
  }
};
