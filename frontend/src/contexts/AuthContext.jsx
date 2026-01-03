// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  async function signup({ name, email, password }) {
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { user: data, error: null };
    } catch (error) {
      console.error("Signup error:", error.response?.data?.message || error.message);
      return { user: null, error: error.response?.data?.message || error.message };
    }
  }

  async function login({ email, password }) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { user: data, error: null };
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      return { user: null, error: error.response?.data?.message || error.message };
    }
  }

  async function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  async function updateProfile(updates) {
    try {
      const { data } = await api.put("/auth/profile", updates);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { user: data, error: null };
    } catch (error) {
      console.error("Profile update error:", error.response?.data?.message || error.message);
      return { user: null, error: error.response?.data?.message || error.message };
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
