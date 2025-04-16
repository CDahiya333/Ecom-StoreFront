import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:3000" : "/api",
  withCredentials: true,
});

// const axiosInstance = axios.create({
//   baseURL: "/api", // Always use relative path in development
//   withCredentials: true, 
// });

export default axiosInstance;