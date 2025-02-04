import API from "axios";

const requestHandler = {
  Headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*", // GET, POST, PUT, DELETE, OPTIONS
    "Access-Control-Allow-Credentials": true,
  },
};
console.log("react app" , process.env.REACT_APP_API_URL)

const axios = API.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: requestHandler.Headers,
});

axios.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export default axios;
