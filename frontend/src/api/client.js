import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const baseMessage = error.response?.data?.message || "Something went wrong.";
    const details = error.response?.data?.details;
    const safeDetails = typeof details === "string" ? details.replace(/key=[A-Za-z0-9._-]+/g, "key=[redacted]") : "";
    const message = safeDetails ? `${baseMessage} ${safeDetails}` : baseMessage;
    return Promise.reject(new Error(message));
  },
);

export default client;
