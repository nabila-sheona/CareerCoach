import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

// Hook to consume AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Wrap your app with this provider
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Core authentication logic
function useProvideAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load persisted auth state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }
  }, []);

  // Login function aligned with backend
  const login = async (email, password) => {
    const payload = { email, password };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const { success, token, message } = response.data;

      if (success && token) {
        const userData = {
          email,
          name: "User", // optionally customize later
        };

        setUser(userData);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        return { success: true, message };
      }

      return { success: false, message: "Login failed: invalid credentials" };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed: server error";
      console.error("Login failed:", errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Logout: clear state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
