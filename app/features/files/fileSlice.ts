import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";
import { File } from "@/app/types/file";
import { SharedWithMeFile, MySharedFile } from "@/app/types/file";
import { toast } from "react-hot-toast";

interface FileState {
  files: File[];
  loading: boolean;
  error: string | null;
  sharedWithMe: SharedWithMeFile[];
  myShares: MySharedFile[];
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
  sharedWithMe: [],
  myShares: [],
};

export const fetchFiles = createAsyncThunk("files/fetchFiles", async () => {
  const response = await api.get("/files/my-files/");
  return response.data.files;
});

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (formData: FormData) => {
    const response = await api.post("/files/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      id: response.data.id,
      file: response.data.file,
      original_filename: response.data.original_filename,
      uploaded_at: response.data.uploaded_at,
      uploaded_by: response.data.uploaded_by
    };
  }
);

export const shareFile = createAsyncThunk<
  any,
  {
    fileId: number;
    shareData: {
      share_type: "public" | "private";
      permission: "view" | "download";
      expires_in_days: number;
      users?: string[];
    };
  }
>("files/shareFile", async ({ fileId, shareData }) => {
  const response = await api.post(`/files/${fileId}/share/`, shareData);
  return response.data;
});

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (fileId: number, { rejectWithValue }) => {
    try {
      console.log("Making delete request for fileId:", fileId);
      const response = await api.delete(`/files/${fileId}/`);
      console.log("Delete response:", response);
      
      // Return fileId even if response is empty
      return fileId;
    } catch (error: any) {
      console.error("Delete API error:", error);
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to delete file"
      });
    }
  }
);

export const fetchSharedWithMe = createAsyncThunk(
  "files/fetchSharedWithMe",
  async () => {
    const response = await api.get("/files/shared-with-me/");
    return response.data.shared_files;
  }
);

export const fetchMyShares = createAsyncThunk(
  "files/fetchMyShares",
  async () => {
    const response = await api.get("/files/my-shares/");
    return response.data.my_shares;
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch files";
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter((file) => file.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteFile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete file";
      })
      .addCase(fetchSharedWithMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSharedWithMe.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedWithMe = action.payload;
      })
      .addCase(fetchMyShares.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyShares.fulfilled, (state, action) => {
        state.loading = false;
        state.myShares = action.payload;
      })
      .addCase(shareFile.fulfilled, (state, action) => {
        toast.success("File shared successfully");
      })
      .addCase(shareFile.rejected, (state, action: any) => {
        toast.error(action.error.message || "Failed to share file");
      });
  },
});

export default fileSlice.reducer;
