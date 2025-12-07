import axios from "axios";

// Base URL env se lenge, warna localhost fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// REQUEST: automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("le_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: auto logout on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("le_token");
      localStorage.removeItem("le_user");

      // Agar admin panel me ho toh home pe redirect
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
