import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";
import { File } from "@/app/types/file";
import { SharedWithMeFile, MySharedFile } from "@/app/types/file";

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
    return response.data;
  }
);

export const shareFile = createAsyncThunk(
  "files/shareFile",
  async ({
    fileId,
    shareData,
  }: {
    fileId: number;
    shareData: {
      share_type: "public" | "private";
      permission: "view" | "download";
      expires_in_days: number;
      users?: string[];
    };
  }) => {
    const response = await api.post(`/files/${fileId}/share/`, shareData);
    return response.data;
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (fileId: number, { rejectWithValue }) => {
    try {
      console.log(fileId, "56");
      const response = await api.delete(`/files/${fileId}`);
      console.log(response, "58");
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete file");
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
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter((file) => file.id !== action.payload);
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
      });
  },
});

export default fileSlice.reducer;
