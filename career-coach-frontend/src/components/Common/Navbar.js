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
                <Button color="inherit" onClick={() => scrollToSection("home")}>
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() => scrollToSection("features")}
                >
                  Features
                </Button>
                <Button
                  color="inherit"
                  onClick={() => scrollToSection("success-stories")}
                >
                  Success Stories
                </Button>
                {userState.isLoggedIn && (
                  <Button
                    color="inherit"
                    onClick={() =>
                      handleFeatureAccess("dashboard") &&
                      scrollToSection("dashboard")
                    }
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>
                )}
                {userState.userType === "admin" && (
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection("admin")}
                    startIcon={<AdminIcon />}
                  >
                    Admin Panel
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
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: "primary.main",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 3
                        }
                      }}
                      onClick={() => scrollToSection("profile")}
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
          <MenuItem
            onClick={() =>
              handleFeatureAccess("dashboard") && scrollToSection("dashboard")
            }
          >
            Dashboard
          </MenuItem>
        )}
        {userState.isLoggedIn && (
          <MenuItem onClick={() => scrollToSection("profile")}>
            Profile
          </MenuItem>
        )}
        {userState.userType === "admin" && (
          <MenuItem onClick={() => scrollToSection("admin")}>
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
