export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    // Add a 30-second buffer to prevent edge cases
    return payload.exp < (currentTime + 30);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const clearExpiredToken = () => {
  const token = localStorage.getItem("token");
  if (token && isTokenExpired(token)) {
    console.log('Clearing expired token...');
    logout();
    return true;
  }
  return false;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  // Check if token is properly formatted
  if (token.split('.').length !== 3) {
    console.log('Invalid token format, clearing...');
    logout();
    return false;
  }
  
  if (isTokenExpired(token)) {
    // Token is expired, clear it and redirect to login
    console.log('Token expired, clearing...');
    logout();
    return false;
  }
  
  return true;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Only redirect if not already on login page
  if (window.location.pathname !== '/') {
    window.location.href = "/";
  }
};

export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};
