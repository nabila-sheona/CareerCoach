import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  Badge,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ onLoginClick, onRegisterClick, onLogoutClick }) => {
  const { userState } = useAuth();
  const location = useLocation();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    handleMobileMenuClose();
  };

  const handleFeatureAccess = (feature) => {
    if (!userState.isLoggedIn) {
      alert("Please login to access this feature");
      onLoginClick();
      return false;
    }
    return true;
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 2,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar>
              {/* Logo */}
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => scrollToSection("home")}
                >
                  <Typography
                    variant="h6"
                    component="h1"
                    color="primary"
                    fontWeight="bold"
                  >
                    CareerCoach
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    Empowering Bangladesh's Future
                  </Typography>
                </Box>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mx: 2 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  sx={{
                    fontWeight: location.pathname === "/" ? "bold" : "normal",
                  }}
                >
                  Home
                </Button>

                <Button
                  color="inherit"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Features
                </Button>

                <Button
                  color="inherit"
                  onClick={() =>
                    document
                      .getElementById("success-stories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Success Stories
                </Button>

                {userState.isLoggedIn && (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/dashboard"
                      sx={{
                        fontWeight:
                          location.pathname === "/dashboard"
                            ? "bold"
                            : "normal",
                      }}
                      startIcon={<DashboardIcon />}
                    >
                      Dashboard
                    </Button>

                    <Button
                      color="inherit"
                      component={Link}
                      to="/cv-review"
                      sx={{
                        fontWeight:
                          location.pathname === "/cv-review"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      CV Review
                    </Button>

                    <Button
                      color="inherit"
                      component={Link}
                      to="/aptitude-tests"
                      sx={{
                        fontWeight:
                          location.pathname === "/aptitude-tests"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      Tests
                    </Button>

                    <Button
                      color="inherit"
                      component={Link}
                      to="/mock-interviews"
                      sx={{
                        fontWeight:
                          location.pathname === "/mock-interviews"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      Interviews
                    </Button>
                  </>
                )}

                {userState.userType === "admin" && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    sx={{
                      fontWeight:
                        location.pathname === "/admin" ? "bold" : "normal",
                    }}
                    startIcon={<AdminIcon />}
                  >
                    Admin
                  </Button>
                )}
              </Box>

              {/* User Actions */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {userState.isLoggedIn && (
                  <IconButton color="inherit" onClick={handleNotificationOpen}>
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                )}

                {userState.isLoggedIn ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      {userState.userName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    >
                      Hi, {userState.userName}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={onLogoutClick}
                      sx={{ ml: 1 }}
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={onLoginClick}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={onRegisterClick}
                    >
                      Register
                    </Button>
                  </Box>
                )}

                {/* Mobile Menu Button */}
                <IconButton
                  color="inherit"
                  aria-label="open menu"
                  edge="end"
                  onClick={handleMobileMenuOpen}
                  sx={{ display: { md: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={() => scrollToSection("home")}>Home</MenuItem>
        <MenuItem onClick={() => scrollToSection("features")}>
          Features
        </MenuItem>
        <MenuItem onClick={() => scrollToSection("success-stories")}>
          Success Stories
        </MenuItem>

        {userState.isLoggedIn && (
          <>
            <MenuItem
              component={Link}
              to="/dashboard"
              onClick={handleMobileMenuClose}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              component={Link}
              to="/cv-review"
              onClick={handleMobileMenuClose}
            >
              CV Review
            </MenuItem>
            <MenuItem
              component={Link}
              to="/aptitude-tests"
              onClick={handleMobileMenuClose}
            >
              Tests
            </MenuItem>
            <MenuItem
              component={Link}
              to="/mock-interviews"
              onClick={handleMobileMenuClose}
            >
              Interviews
            </MenuItem>
          </>
        )}

        {userState.userType === "admin" && (
          <MenuItem
            component={Link}
            to="/admin"
            onClick={handleMobileMenuClose}
          >
            Admin Panel
          </MenuItem>
        )}

        {!userState.isLoggedIn ? (
          <>
            <MenuItem onClick={onLoginClick}>Login</MenuItem>
            <MenuItem onClick={onRegisterClick}>Register</MenuItem>
          </>
        ) : (
          <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        )}
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      >
        <MenuItem onClick={handleNotificationClose}>
          <Box>
            <Typography variant="body2">Your CV analysis is ready</Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box>
            <Typography variant="body2">New aptitude test available</Typography>
            <Typography variant="caption" color="text.secondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box>
            <Typography variant="body2">Interview practice reminder</Typography>
            <Typography variant="caption" color="text.secondary">
              2 days ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
