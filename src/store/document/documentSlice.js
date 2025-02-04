import { createSlice } from "@reduxjs/toolkit";
import {
    UploadDocumentApi,
    getallDocsFunApi,
    deleteDocsFunApi
} from "./services";

const documentSlice = createSlice({
  name: "document",
  initialState: {
    document: {
      data: [],
      isLoading: false,
      error: null,
    },
    documentAll: {
      data: [],
      isLoading: false,
      error: null,
      dataFatched: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UploadDocumentApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UploadDocumentApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.otpVerified = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.role = action.payload?.user.role;
        state.isVerified = action.payload?.user.verified;
      })
      .addCase(UploadDocumentApi.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });
      builder
      .addCase(getallDocsFunApi.pending, (state, action) => {
        state.documentAll.isLoading = true;
        state.documentAll.error = null;
      })
      .addCase(getallDocsFunApi.fulfilled, (state, action) => {
        state.documentAll.isLoading = false;
        state.documentAll.data = action.payload.docsData; // Update here
        state.documentAll.dataFatched = true;
      })
      .addCase(getallDocsFunApi.rejected, (state, action) => {
        state.documentAll.isLoading = false;
        state.documentAll.data = null;
        state.documentAll.error = action.payload;
        state.documentAll.dataFatched = true;
      });
      builder
      .addCase(deleteDocsFunApi.pending, (state) => {
        state.documentAll.isLoading = true;
        state.documentAll.error = null;
      })
      .addCase(deleteDocsFunApi.fulfilled, (state, action) => {
        console.log("action in delete docs", action.payload);
      
        // Parse the stringified docsId
        const parsedDocsId = JSON.parse(action.payload.docsId).docsId;
        console.log("parsedDo", parsedDocsId);
      
        // Debug current state data
        console.log("Current data before filtering:", state.documentAll.data);
      
        // Update the state immutably
        state.documentAll.isLoading = false;
        // state.documentAll.data = state.documentAll.data.filter((doc) => {
        //   console.log("Comparing IDs:", doc.docsId, parsedDocsId);
        //   return doc.docsId !== parsedDocsId;
        // });
      
        // Debug updated state data
        console.log("Data after filtering:", state.documentAll.data);
      })
      
      .addCase(deleteDocsFunApi.rejected, (state, action) => {
        state.documentAll.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const documentReducer = documentSlice.reducer;
