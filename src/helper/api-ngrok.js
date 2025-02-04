import API from "axios";

const axiosNgrok = API.create({
  baseURL: "https://759c-173-208-156-111.ngrok-free.app", // Add baseURL for ngrok
});

axiosNgrok.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export default axiosNgrok;