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
    // A 401 means the real JWT expired or was invalid. Demo sessions use a
    // "demo-" token that is intentionally not a valid JWT, so a 401 from a
    // demo session is expected (the backend has no such user) and must NOT
    // trigger a logout / "session expired" — otherwise demo navigation
    // would be kicked back to the login page on every API call.
    const token = localStorage.getItem("token");
    const isDemoSession = token && token.startsWith("demo-");
    if (error.response && error.response.status === 401 && !isDemoSession) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("bloodlink:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
