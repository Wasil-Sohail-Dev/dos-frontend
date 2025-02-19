import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "helper/api";
import {
  loginApi,
  registerApi,
  healthProviderApi,
  verifyOtpApi,
  checkTokenIsValidApi,
  autoLoginApi,
  logoutApi,
  getAllUsersApi,
  getUserDetailsApi,
  updateUserDetailsApi,
  getalladmins,
} from "./constrants";
import toast from "react-hot-toast";
// import axiosImage from "helper/api-image"

export const loginFunApi = createAsyncThunk(
  "auth/login",
  async ({ data, onSuccess }) => {
    try {
      const response = await axios.post(loginApi, data);
      console.log("response in loginFun => ", response.data);
      if (response.data.status === "success") {
        const responseData = response.data.data;
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("user", JSON.stringify(responseData.user));

        if (onSuccess) {
          onSuccess(responseData);
          toast.success(response.data.message);
        }
        return;
      } else {
        console.log("Error response in login Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in login Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const registerFunApi = createAsyncThunk(
  "auth/register",
  async ({ data, onSuccess }) => {
    try {
      const response = await axios.post(registerApi, data);
      console.log("response in registerFunApi => ", response.data);
      if (response.data.status === "success") {
        const responseData = response.data.data;

        if (onSuccess) {
          onSuccess(responseData.user);
        }
        toast.success(response.data.message);

        return;
      } else {
        console.log("Error response in register Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in register Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const healthProviderDetailFunApi = createAsyncThunk(
  "auth/healthProvider",
  async ({ data, onSuccess }) => {
    try {
      const response = await axios.post(healthProviderApi, data);
      console.log("response in healthProviderFunApi => ", response.data);
      if (response.data.status === "success") {
        const responseData = response.data.data;
        console.log("77", responseData.user);
        if (onSuccess) {
          onSuccess(responseData.user);
        }
        toast.success(response.data.message);

        return;
      } else {
        console.log("Error response in health Provider Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in health Provider Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const verifyOtpFunApi = createAsyncThunk(
  "auth/verifyOtpApi",
  async ({ data, onSuccess }) => {
    console.log("value", data);
    try {
      const response = await axios.post(verifyOtpApi, data);
      console.log("response in verifyOtpApi => ", response.data);
      if (response.data.status === "success") {
        localStorage.removeItem("selectedBusinessId");

        const responseData = response.data.data;

        if (responseData.user.role !== "user") {
          if (data.forLogin) {
            localStorage.setItem("token", responseData.token);
            toast.success("Otp Verifed Successfully");
            if (onSuccess) {
              onSuccess();
            }
            return responseData;
          } else {
            toast.success("Otp Verifed Successfully");
            if (onSuccess) {
              onSuccess();
            }
            return;
          }
        } else {
          const errorMsg = data.forLogin
            ? "You are not authorized to access dashboard"
            : "You are not authorized to reset password";
          toast.error(errorMsg);
          throw new Error(errorMsg);
        }
      } else {
        console.log("Error response in login Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in verifyOtpApi => ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const checkTokenIsValidFunApi = createAsyncThunk(
  "auth/checkTokenIsValid",
  async () => {
    console.log("checkTokenIsValidFunApi");
    try {
      const response = await axios.get(checkTokenIsValidApi);
      console.log("response in checkTokenIsValidFun => ", response.data);
      if (response.data.status === "success") {
        // localStorage.removeItem('selectedBusinessId')
        return response.data.data;
      } else {
        console.log(
          "Error response in checkTokenIsValidFun Api => ",
          response.data
        );
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in checkTokenIsValidFun Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }

      throw error;
    }
  }
);

export const autoLoginFunApi = createAsyncThunk(
  "auth/autoLogin",
  async ({ onSuccess }) => {
    try {
      const response = await axios.get(checkTokenIsValidApi);
      console.log("response in checkTokenIsValidFun => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess();
        }
        return response.data.data;
      } else {
        console.log(
          "Error response in checkTokenIsValidFun Api => ",
          response.data
        );
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in checkTokenIsValidFun Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }

      throw error;
    }
  }
);

export const logoutFunApi = createAsyncThunk(
  "auth/logout",
  async ({ onSuccess }) => {
    try {
      const response = await axios.get(logoutApi);
      console.log("response in logoutFunApi => ", response.data);
      if (response.data.status === "success") {
        // Clear local storage
        localStorage.clear();
        if (onSuccess) {
          onSuccess();
        }
        toast.success("Logged out successfully");
        return;
      } else {
        console.log("Error response in logout Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in logout Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const getAllUsersFunApi = createAsyncThunk(
  "auth/getAllUsers",
  async ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', allUsers = false, role=null, onSuccess }) => {
    try {
      const response = await axios.get(`${getAllUsersApi}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&allUsers=${allUsers}&role=${role}`);
      console.log("response in getAllUsers => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        return response.data.data;
      } else {
        console.log("Error response in getAllUsers Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in getAllUsers Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const getUserDetailsFunApi = createAsyncThunk(
  "auth/getUserDetails",
  async ({ data, onSuccess }) => {
    console.log(data, "dataaa");

    try {
      const response = await axios.post(getUserDetailsApi, data);
      console.log("response in getUserDetails => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        return response.data.data;
      } else {
        console.log("Error response in getUserDetails Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in getUserDetails Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const getAllAdminsFunApi = createAsyncThunk(
  "auth/getAllAdmins",
  async ({ onSuccess }) => {
    try {
      const response = await axios.get(getalladmins);
      console.log("response in getAllAdmins => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess(response.data.data.admins);
        }
        return response.data.data.admins;
      } else {
        console.log("Error response in getAllAdmins Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in getAllAdmins Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);

export const updateUserDetailsFunApi = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ data, onSuccess }) => {
    try {
      const response = await axios.post(updateUserDetailsApi, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("response in updateUserDetails => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess(response.data.user);
          toast.success(response.data.message);
        }
        // Update local storage with new user data if needed
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          profilePicture: response.data.user.profilePicture
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return response.data.user;
      } else {
        console.log(
          "Error response in updateUserDetails Api => ",
          response.data
        );
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in updateUserDetails Api ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      toast.error(err);
      throw new Error(err);
    }
  }
);
