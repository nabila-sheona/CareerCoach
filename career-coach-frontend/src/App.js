import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Common/Navbar";
import Home from "./components/Sections/Home";
import Features from "./components/Sections/Features";
import SuccessStories from "./components/Sections/SuccessStories";
import Dashboard from "./components/Sections/Dashboard";
import AdminPanel from "./components/Sections/AdminPanel";
import LoginModal from "./components/Modals/LoginModal";
import RegisterModal from "./components/Modals/RegisterModal";
import AccessNotice from "./components/Common/AccessNotice";
import Footer from "./components/Common/Footer";
import { getCurrentUser } from "./utils/auth";
import { AuthProvider } from "./components/context/AuthContext";

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
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isLoggedIn: true,
        userType: user.isAdmin ? "admin" : "registered",
        userName: user.name || user.email,
        userEmail: user.email,
      });
    }
  }, []);

  const handleLogin = (userData) => {
    setUserState({
      isLoggedIn: true,
      userType: userData.isAdmin ? "admin" : "registered",
      userName: userData.name || userData.email,
      userEmail: userData.email,
    });
    setLoginModalOpen(false);
  };

  const handleRegister = (userData) => {
    setUserState({
      isLoggedIn: true,
      userType: "registered",
      userName: userData.name,
      userEmail: userData.email,
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider value={{ userState, handleLogin, handleLogout }}>
        <Router>
          <div className="App">
            <Navbar
              userState={userState}
              onLoginClick={() => setLoginModalOpen(true)}
              onRegisterClick={() => setRegisterModalOpen(true)}
              onLogoutClick={handleLogout}
            />

            {!userState.isLoggedIn && <AccessNotice />}

            <Home
              userState={userState}
              onGetStartedClick={() => {
                if (!userState.isLoggedIn) {
                  setRegisterModalOpen(true);
                }
              }}
            />

            <Features userState={userState} />
            <SuccessStories />

            {userState.isLoggedIn && (
              <>
                <Dashboard userState={userState} />
                {userState.userType === "admin" && <AdminPanel />}
              </>
            )}

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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
