import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Hook to use the Auth context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider wraps your app and provides authentication
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for managing auth logic
function useProvideAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwtToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Assuming backend sends this shape:
      // {
      //   message: "Login successful",
      //   token: "<jwt>",
      //   user: { email: "<email>" }
      // }

      const { token, user: userInfo, message } = response.data;

      if (token && userInfo?.email) {
        setUser({ email: userInfo.email });
        localStorage.setItem('user', JSON.stringify({ email: userInfo.email }));
        localStorage.setItem('jwtToken', token);
        return { success: true, message };
      }

      return { success: false, message: 'Unexpected response structure' };

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Login failed: server rejected request';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
