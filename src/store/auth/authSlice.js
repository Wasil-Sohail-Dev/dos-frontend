import { createSlice } from "@reduxjs/toolkit";
import {
  autoLoginFunApi,
  checkTokenIsValidFunApi,
  healthProviderDetailFunApi,
  loginFunApi,
  registerFunApi,
  verifyOtpFunApi,
  updateUserDetailsFunApi,
  getAllUsersFunApi,
  getAllAdminsFunApi,
} from "./services";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    isVerified: false,
    otpVerified: false,
    token: null,
    role: null,
    dataFatched: false,
    validToken: {
      valid: false,
      isLoading: false,
      dataFetched: false,
    },
    allUsers: {
      data: null,
      isLoading: false,
      error: null,
    },
    allAdmins: {
      data: [],
      isLoading: false,
      error: null,
    },

    editUser: {
      data: null,
      isLoading: false,
      error: null,
      dataFatched: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginFunApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginFunApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.otpVerified = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.role = action.payload?.user.role;
        state.isVerified = action.payload?.user.verified;
        console.log("token", action.payload);
      })
      .addCase(loginFunApi.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });

    builder
      .addCase(registerFunApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerFunApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.otpVerified = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.role = action.payload?.user.role;
        state.isVerified = action.payload?.user.verified;
      })
      .addCase(registerFunApi.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });

    builder
      .addCase(healthProviderDetailFunApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(healthProviderDetailFunApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.otpVerified = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.role = action.payload?.user.role;
        state.isVerified = action.payload?.user.verified;
      })
      .addCase(healthProviderDetailFunApi.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });

    builder
      .addCase(verifyOtpFunApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtpFunApi.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload !== undefined) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.isVerified = action.payload.user.verified;
          state.token = action.payload.token;
          state.role = action.payload.user.role;
          state.otpVerified = true;
          localStorage.setItem("otpVerified", true);
        }
      })
      .addCase(verifyOtpFunApi.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });

    builder
      .addCase(checkTokenIsValidFunApi.pending, (state) => {
        state.validToken.isLoading = true;
      })
      .addCase(checkTokenIsValidFunApi.fulfilled, (state, action) => {
        state.validToken.isLoading = false;
        state.validToken.valid = true;
        state.validToken.dataFetched = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isVerified = action.payload.user.verified;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.otpVerified =
          localStorage.getItem("otpVerified")?.toString() === "true";
      })
      .addCase(checkTokenIsValidFunApi.rejected, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("otpVerified");
        state.validToken.isLoading = false;
        state.validToken.valid = false;
        state.validToken.dataFetched = true;
        state.isAuthenticated = false;
        state.user = null;
        state.isVerified = false;
        state.role = null;
        state.token = null;
        state.otpVerified = false;
      });
    builder.addCase(autoLoginFunApi.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.validToken.isLoading = false;
      state.validToken.valid = true;
      state.validToken.dataFetched = true;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isVerified = action.payload.user.verified;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.otpVerified =
        localStorage.getItem("otpVerified")?.toString() === "true";
    });

    builder
      .addCase(updateUserDetailsFunApi.pending, (state) => {
        state.editUser.isLoading = true;
        state.editUser.error = null;
      })
      .addCase(updateUserDetailsFunApi.fulfilled, (state, action) => {
        state.editUser.isLoading = false;
        state.editUser.dataFatched = true;
        state.editUser.error = null;
        state.user = { ...state.user, ...action.payload };
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...action.payload })
        );
      })
      .addCase(updateUserDetailsFunApi.rejected, (state, action) => {
        state.editUser.isLoading = false;
        state.editUser.dataFatched = false;
        state.editUser.error = action.error.message;
      });

    builder
      .addCase(getAllUsersFunApi.pending, (state) => {
        state.allUsers.isLoading = true;
        state.allUsers.error = null;
      })
      .addCase(getAllUsersFunApi.fulfilled, (state, action) => {
        state.allUsers.isLoading = false;
        state.allUsers.data = action.payload;
        state.allUsers.error = null;
      })
      .addCase(getAllUsersFunApi.rejected, (state, action) => {
        state.allUsers.isLoading = false;
        state.allUsers.error = action.error.message;
      });

      builder
      .addCase(getAllAdminsFunApi.pending, (state) => {
        state.allAdmins.isLoading = true;
        state.allAdmins.error = null;
      })
      .addCase(getAllAdminsFunApi.fulfilled, (state, action) => {
        state.allAdmins.isLoading = false;
        state.allAdmins.data = action.payload; // Update the data here
        state.allAdmins.dataFatched = true;
        state.allAdmins.error = null;
      })
      .addCase(getAllAdminsFunApi.rejected, (state, action) => {
        state.allAdmins.isLoading = false;
        state.allAdmins.dataFatched = false;
        state.allAdmins.error = action.error.message;
      });
  },
});

export const authReducer = authSlice.reducer;
