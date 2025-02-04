import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "helper/api";
import { deleteDocsApi, documentUpload, getalldocs, updateDocsCategoryApiConst } from "./contraints";
import toast from "react-hot-toast";
import axiosImage from "helper/api-image";

export const UploadDocumentApi = createAsyncThunk(
  "document/upload",
  async ({ data, onSuccess }) => {
    try {
      const response = await axiosImage.post(documentUpload, data);
      console.log("response in document upload Fun Api => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          toast.success("Document Uploaded Successfully");
          onSuccess();
        }
        return;
      } else {
        console.log("Error response in document Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in Document Api ", error);
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

export const getallDocsFunApi = createAsyncThunk(
  "docs/getallDocs",
  async ({ onSuccess }) => {
    try {
      const response = await axios.get(getalldocs);
      console.log("response in get all docs => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess(response.data.data);
          // toast.success(response.data.message);
        }
        return response.data.data;
      } else {
        console.log("Error response all docs Api => ", response.data.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";
        console.log("err: ", err);
        if (err !== "Docs not found") {
          toast.error(err);
        }
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in all Docs", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      if (err !== "Docs not found") {
        toast.error(err);
      }

      throw new Error(err);
    }
  }
);

export const deleteDocsFunApi = createAsyncThunk(
  "docs/delete",
  async ({ onSuccess, data }) => {
    console.log("data dipatching", data);
    try {
      const response = await axios.post(deleteDocsApi, data);
      console.log("response in delete docs api => ", response.data);
      if (response.data.message === "Document deleted successfully") {
        if (onSuccess) {
          onSuccess();
          toast.success(response.data.message);
        }
        return { ...response.data, docsId: data }; // Include docsId manually
      } else {
        const err = response?.data?.message || "Something went wrong!";
        console.log("Error response delete docs api => ", response.data);
        if (err !== "Docs not found") {
          toast.error(err);
        }
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in delete docs api", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      if (err !== "Docs not found") {
        toast.error(err);
      }

      throw new Error(err);
    }
  }
);

export const updateDocsCategoryApi = createAsyncThunk(
  "docs/updateCategory",
  async ({ data, onSuccess }) => {
    try {
      const response = await axios.post(updateDocsCategoryApiConst, data);
      console.log("response in update category api => ", response.data);
      if (response.data.status === "success") {
        if (onSuccess) {
          onSuccess();
          toast.success("Category updated successfully");
        }
        return response.data;
      } else {
        const err = response?.data?.message || "Something went wrong!";
        console.log("Error response update category api => ", response.data);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in update category api", error);
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
