import { createSlice } from "@reduxjs/toolkit";
import { AlDocsSummaryApi } from "./services";

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    summary: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AlDocsSummaryApi.pending, (state) => {
        state.summary.isLoading = true;
        state.summary.error = null;
      })
      .addCase(AlDocsSummaryApi.fulfilled, (state, action) => {
        state.summary.isLoading = false;
        state.summary.data = action.payload?.data || []; 
    })
      .addCase(AlDocsSummaryApi.rejected, (state, action) => {
        state.summary.isLoading = false;
        state.summary.error =
          action.payload || "Failed to upload document. Please try again.";
      });
  },
});

export const summaryReducer = summarySlice.reducer;
