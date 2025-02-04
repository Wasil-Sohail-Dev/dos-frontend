import API from "axios";

export const requestHandler = {
  Headers: {
    "Content-Type": "application/json",
    "Content-type": "multipart/form-data",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*", // GET, POST, PUT, DELETE, OPTIONS
    "Access-Control-Allow-Credentials": true,
  },
};

const axiosImage = API.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: requestHandler.Headers,
});

axiosImage.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export default axiosImage;
