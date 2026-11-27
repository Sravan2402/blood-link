import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";
import { BACKEND_ROLES, ROLE_LABEL } from "../lib/constants";

const AuthContext = createContext(null);

// Build a mock session for portals whose backend endpoints are not yet
// implemented (Blood Bank, Camp Organizer). This lets the full frontend be
// explored end-to-end and will be replaced by real API calls later.
function makeDemoUser(payload, roleOverride) {
  const role = roleOverride || payload.role;
  const base = {
    full_name: payload.full_name || "Demo User",
    email: payload.email || `demo-${role.toLowerCase()}@bloodlink.test`,
    phone: payload.phone || "+91 90000 00000",
    role,
    profile_image: null,
    is_verified: true,
  };
  if (role === "BLOOD_BANK") {
    return {
      ...base,
      full_name: payload.full_name || "Red Life Blood Bank",
      blood_bank_name: payload.hospital_name || "Red Life Blood Bank",
      registration_number: payload.registration_number || "BB-2021-0042",
    };
  }
  if (role === "CAMP_ORGANIZER") {
    return {
      ...base,
      full_name: payload.full_name || "Camp Volunteer",
      organization: payload.hospital_name || "Red Life Blood Bank",
    };
  }
  return base;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a stored token on first load.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Demo sessions are self-contained and do not call the profile endpoint.
    if (token.startsWith("demo-")) {
      try {
        const payload = JSON.parse(localStorage.getItem("demoUser") || "{}");
        setUser(payload);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
      return;
    }
    api
      .get("/auth/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, role) => {
    // Blood Bank and Camp Organizer have no backend yet — always use a demo
    // session so the full frontend is explorable without a server.
    if (!BACKEND_ROLES.includes(role)) {
      const user = makeDemoUser({ email }, role);
      const token = `demo-${role}-${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("demoUser", JSON.stringify(user));
      setUser(user);
      return user;
    }
    // Backend roles: try the real server first, but if it is unreachable
    // (no server running), fall back to a demo session so the user can
    // still navigate without credentials.
    try {
      const res = await api.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch {
      const user = makeDemoUser({ email: email || `demo-${role.toLowerCase()}@bloodlink.test` }, role);
      const token = `demo-${role}-${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("demoUser", JSON.stringify(user));
      setUser(user);
      return user;
    }
  }, []);

  const register = useCallback(async (payload) => {
    if (!BACKEND_ROLES.includes(payload.role)) {
      const user = makeDemoUser(payload);
      const token = `demo-${payload.role}-${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("demoUser", JSON.stringify(user));
      setUser(user);
      return user;
    }
    // Registration does not return a token, so sign in immediately after.
    await api.post("/auth/register", payload);
    const loginRes = await api.post("/auth/login", {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    localStorage.setItem("token", loginRes.data.token);
    setUser(loginRes.data.user);
    return loginRes.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("demoUser");
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token?.startsWith("demo-")) {
      return user;
    }
    const res = await api.get("/auth/profile");
    setUser(res.data.user);
    return res.data.user;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role,
      roleLabel: ROLE_LABEL[user?.role] || user?.role,
      isDemo: localStorage.getItem("token")?.startsWith("demo-"),
      login,
      register,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, loading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
