import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";
import { AdminShare } from "@/app/types/file";
import { toast } from "react-hot-toast";

interface AdminState {
  adminShares: AdminShare[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  adminShares: [],
  loading: false,
  error: null,
};

export const fetchAdminShares = createAsyncThunk(
  "admin/fetchShares",
  async () => {
    const response = await api.get("/files/all-shares/");
    return response.data.shares;
  }
);

export const revokeShare = createAsyncThunk(
  "admin/revokeShare",
  async (shareId: number) => {
    await api.delete(`/files/${shareId}/delete-share/`);
    return shareId;
  }
);

export const downloadSharedFile = createAsyncThunk(
  "admin/downloadFile",
  async ({ fileId, fileName }: { fileId: number; fileName: string }) => {
    const response = await api.get(`/files/${fileId}/download/`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminShares.fulfilled, (state, action) => {
        state.adminShares = action.payload;
      })
      .addCase(revokeShare.fulfilled, (state, action) => {
        state.adminShares = state.adminShares.filter(
          share => share.id !== action.payload
        );
        toast.success('Share access revoked');
      });
  },
});

export default adminSlice.reducer; 