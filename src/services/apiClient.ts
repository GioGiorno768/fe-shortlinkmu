import axios from "axios";
import { getToken, removeToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle Global Errors (401, etc)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // removeToken(); // Optional: Auto logout? Careful with loop
      // window.location.href = "/auth/login"; // Optional
    }
    return Promise.reject(error);
  }
);

export default apiClient;
