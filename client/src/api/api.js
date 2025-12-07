import axios from "axios";

// ----- BASE URL SETUP -----
// Env se lenge, agar waha na mile to localhost pe fallback karenge
// Example .env (frontend):
// VITE_API_BASE_URL=https://learnease-fbzj.onrender.com/api

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")) || // last ka "/" hata diya
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// ----- REQUEST: automatically attach token -----
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("le_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- RESPONSE: auto logout on 401/403 -----
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
