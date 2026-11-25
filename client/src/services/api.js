import axios from "axios";

const api = axios.create({
  // Use a relative base so the Vite dev server proxy (see vite.config.js)
  // forwards requests to the Express backend. Falls back to an env override.
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach the JWT to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired / invalid tokens globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("bloodlink:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
