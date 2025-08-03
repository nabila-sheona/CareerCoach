import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Hook to use context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook that encapsulates auth logic
function useProvideAuth() {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwtToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser)); // Set user if logged in
    }
  }, []);

  // Login function (connects to backend)
  const login = async (email, password) => {
    try {
      // Send POST request to your backend (Spring Boot API)
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });

      // If login is successful, store the JWT token and user info
      if (response.data !== "Invalid credentials") {
        const { email } = response.data.user; // Assuming response contains user data
        const token = response.data.token; // JWT token

        setUser({ email });
        localStorage.setItem('user', JSON.stringify({ email })); // Store user info
        localStorage.setItem('jwtToken', token); // Store JWT token
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
  };

  return {
    user,
    isAuthenticated: !!user, // If user exists, they're authenticated
    login,
    logout,
  };
}
