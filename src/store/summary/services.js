import { createAsyncThunk } from "@reduxjs/toolkit";
import { AlDocsSummary, AlDocsSummaryAudio } from "./contraints";
import toast from "react-hot-toast";
import axiosImage from "helper/api-image";

export const AlDocsSummaryApi = createAsyncThunk(
  "documentsummary/upload/",
  async ({ data, onSuccess, isFile }) => {
    try {
      const response = await axiosImage.post(isFile?AlDocsSummaryAudio:AlDocsSummary, data);
      console.log("Response Structure:", JSON.stringify(response.data.data, null, 2));
      if (response.data.status === "success") {

        if (onSuccess) {
          if (response.data.data) {
            console.log("response data",response.data)

            console.log("16",response.data.data)
            onSuccess(response.data.data);
          }else{
            onSuccess(response.data.data.message);
            console.log("16",response.data.data)
            toast.success(response.data.data.message);

          }
          toast.success("Document Uploaded Successfully");
        }
        return;
      } else {
        console.log("Error response in Al document Api => ", response.data);
        const err =
          response?.data?.message ||
          response?.message ||
          "Something went wrong!";  
        console.log("err: ", err);
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in Al Document Api ", error);
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
