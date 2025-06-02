import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://172.20.10.4:8000",
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        Cookies.remove("token", { path: "/" });
        localStorage.removeItem("token");
        window.location.href = "/login?redirect=" + window.location.pathname;
        return Promise.reject(error);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
