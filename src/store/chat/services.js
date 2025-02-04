import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from '../../helper/api';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, onSuccess, onError }) => {
    console.log("Sending message:", message);
    try {
      const response = await axios.post('/chat/', {
        message: message
      });
      
      console.log("API Response:", response.data);
      
      if (response.data.result) {
        if (onSuccess) {
          onSuccess(response.data.result);
        }
        return response.data.result;
      } else {
        console.log("Error response in chat API => ", response.data);
        const err = "Something went wrong!";
        console.log("err: ", err);
        if (onError) {
          onError(err);
        }
        toast.error(err);
        throw new Error(err);
      }
    } catch (error) {
      console.log("Error in Chat API ", error);
      let err =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      if (err === "Network Error") {
        err = "Please check your internet connection";
      }
      if (onError) {
        onError(err);
      }
      toast.error(err);
      throw new Error(err);
    }
  }
); 