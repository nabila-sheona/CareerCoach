import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Common/Navbar";
import Home from "./components/Sections/Home";
import Features from "./components/Sections/Features";
import SuccessStoriesPage from "./components/SuccessStoriesPage.js";
import CVReview from "./pages/CVReviewPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AptitudeTests from "./components/AptitudeTests";
import MockInterviews from "./components/MockInterviews";
import AdminPanel from "./components/Sections/AdminPanel";
import LoginModal from "./components/Modals/LoginModal";
import RegisterModal from "./components/Modals/RegisterModal";
import AccessNotice from "./components/Common/AccessNotice";
import Footer from "./components/Common/Footer";
import { getCurrentUser, clearExpiredToken } from "./utils/auth";
import { userAPI } from "./services/api";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage"; // Add this import
import { NotificationProvider } from "./components/context/NotificationContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e40af",
      light: "#3b82f6",
      dark: "#1e3a8a",
    },
    secondary: {
      main: "#059669",
      light: "#10b981",
      dark: "#047857",
    },
    error: {
      main: "#dc2626",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.75rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [userState, setUserState] = useState({
    isLoggedIn: false,
    userType: "anonymous",
    userName: "",
    userEmail: "",
    profilePicture: "",
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    // Clear expired token on app initialization
    clearExpiredToken();
    
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isLoggedIn: true,
        userType: user.isAdmin ? "admin" : "registered",
        userName: user.name || user.email,
        userEmail: user.email,
        profilePicture: user.profilePicture || "",
      });
      // Fetch latest profile data to get profile picture
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      console.log('=== PROFILE FETCH DEBUG ===');
      console.log('Profile API response:', response.data);
      const profileData = response.data.user; // Fix: Access nested user object
      console.log('Profile data:', profileData);
      console.log('Profile picture from API:', profileData?.profilePicture);
      console.log('Profile picture length:', profileData?.profilePicture?.length);
      console.log('About to update userState with profile picture');
      console.log('============================');
      
      if (profileData && profileData.profilePicture) {
        setUserState(prevState => ({
          ...prevState,
          profilePicture: profileData.profilePicture,
        }));
        
        // Update localStorage with profile picture
        const currentUser = getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, profilePicture: profileData.profilePicture };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        console.log("No profile picture found in profile data");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleLogin = async (userData) => {
    setUserState({
      isLoggedIn: true,
      userType: userData.isAdmin ? "admin" : "registered",
      userName: userData.name || userData.email,
      userEmail: userData.email,
      profilePicture: "",
    });
    setLoginModalOpen(false);
    
    // Fetch profile data to get profile picture
    try {
      const response = await userAPI.getProfile();
      const profileData = response.data.user; // Fix: Access nested user object
      
      if (profileData && profileData.profilePicture) {
        setUserState(prevState => ({
          ...prevState,
          profilePicture: profileData.profilePicture,
        }));
        
        // Update localStorage with profile picture
        const currentUser = getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, profilePicture: profileData.profilePicture };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile after login:", error);
    }
  };

  const handleRegister = (userData) => {
    setUserState({
      isLoggedIn: true,
      userType: "registered",
      userName: userData.name,
      userEmail: userData.email,
      profilePicture: "",
    });
    setRegisterModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState({
      isLoggedIn: false,
      userType: "anonymous",
      userName: "",
      userEmail: "",
    });
  };

  const updateProfilePicture = (profilePictureUrl) => {
    console.log('=== UPDATE PROFILE PICTURE CALLED ===');
    console.log('New profile picture URL:', profilePictureUrl);
    
    setUserState(prevState => {
      console.log('Previous userState:', prevState);
      const newState = {
        ...prevState,
        profilePicture: profilePictureUrl || "",
      };
      console.log('New userState:', newState);
      return newState;
    });
    
    // Update localStorage with profile picture
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, profilePicture: profilePictureUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log('Updated localStorage user:', updatedUser);
    }
    console.log('======================================');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider value={{ userState, handleLogin, handleLogout }}>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar
                userState={userState}
                onLoginClick={() => setLoginModalOpen(true)}
                onRegisterClick={() => setRegisterModalOpen(true)}
                onLogoutClick={handleLogout}
              />

              {!userState.isLoggedIn && <AccessNotice />}

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home
                      userState={userState}
                      onGetStartedClick={() => {
                        if (!userState.isLoggedIn) {
                          setRegisterModalOpen(true);
                        }
                      }}
                    />
                    <Features userState={userState} />
                    <SuccessStoriesPage />
                  </>
                }
              />

              <Route
                path="/success-stories-page"
                element={
                  <ProtectedRoute>
                    <SuccessStoriesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cv-review"
                element={
                  <ProtectedRoute>
                    <CVReview />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/aptitude-tests"
                element={
                  <ProtectedRoute>
                    <AptitudeTests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mock-interviews"
                element={
                  <ProtectedRoute>
                    <MockInterviews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Add Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage onProfilePictureUpdate={updateProfilePicture} />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <LoginModal
              open={loginModalOpen}
              onClose={() => setLoginModalOpen(false)}
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                setLoginModalOpen(false);
                setRegisterModalOpen(true);
              }}
            />

            <RegisterModal
              open={registerModalOpen}
              onClose={() => setRegisterModalOpen(false)}
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setRegisterModalOpen(false);
                setLoginModalOpen(true);
              }}
            />

            <Footer />
          </div>
        </Router>
        
        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
