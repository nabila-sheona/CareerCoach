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
  Divider,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  Quiz as TestIcon,
  Mic as InterviewIcon,
  Description as CVIcon,
  Close as CloseIcon,
  NotificationsActive as NotificationsActiveIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-1px)",
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  fontWeight: active ? 600 : 500,
  fontSize: "0.95rem",
  textTransform: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  minWidth: "auto",
  position: "relative",
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-1px)",
  },
  "&::after": active ? {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: 2,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 1,
  } : {},
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.primary.main,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  fontSize: "1rem",
  fontWeight: 600,
}));

// Enhanced NotificationBadge with better visibility
const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontSize: "0.7rem",
    minWidth: 20,
    height: 20,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.5)}`,
    animation: "pulse 2s infinite",
    zIndex: 1,
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

// Updated notification icon button - removed background colors and glow effect
const NotificationIconButton = styled(IconButton)(({ theme, hasNotifications }) => ({
  position: "relative",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  color: hasNotifications ? theme.palette.primary.main : theme.palette.text.primary,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "scale(1.05)",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(1),
    minWidth: 280, // Increased width for better notification display
    maxWidth: 350,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    backdropFilter: "blur(20px)",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

// Enhanced notification menu item
const NotificationMenuItem = styled(MenuItem)(({ theme, unread }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  position: "relative",
  transition: "all 0.2s ease-in-out",
  backgroundColor: unread ? alpha(theme.palette.primary.main, 0.05) : "transparent",
  borderLeft: unread ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ onLoginClick, onRegisterClick, onLogoutClick }) => {
  const { userState } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    event.preventDefault();
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    handleMobileMenuClose();
  };

  const navigationItems = [
    { label: "Home", path: "/", icon: HomeIcon },
    ...(userState.isLoggedIn ? [
      { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { label: "CV Review", path: "/cv-review", icon: CVIcon },
      { label: "Tests", path: "/aptitude-tests", icon: TestIcon },
      { label: "Interviews", path: "/mock-interviews", icon: InterviewIcon },
    ] : []),
    ...(userState.userType === "admin" ? [
      { label: "Admin", path: "/admin", icon: AdminIcon },
    ] : []),
  ];

  const notifications = [
    {
      id: 1,
      title: "Your CV analysis is ready",
      description: "Your CV has been analyzed with detailed feedback and suggestions.",
      time: "2 hours ago",
      unread: true,
      type: "cv",
    },
    {
      id: 2,
      title: "New aptitude test available",
      description: "A new logical reasoning test has been added to your dashboard.",
      time: "1 day ago",
      unread: true,
      type: "test",
    },
    {
      id: 3,
      title: "Interview practice reminder",
      description: "Don't forget to practice your mock interview sessions.",
      time: "2 days ago",
      unread: false,
      type: "interview",
    },
    {
      id: 4,
      title: "Profile completion",
      description: "Complete your profile to get better job recommendations.",
      time: "3 days ago",
      unread: false,
      type: "profile",
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    // This would typically update the notifications state/backend
    console.log("Marking all notifications as read");
    handleNotificationClose();
  };

  const handleNotificationClick = (notification) => {
    // Handle individual notification click
    console.log("Clicked notification:", notification);
    handleNotificationClose();
  };

  return (
    <>
      <HideOnScroll>
        <StyledAppBar position="sticky" elevation={0}>
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, minHeight: { xs: 64, sm: 70 } }}>
              {/* Logo Section */}
              <LogoBox onClick={() => scrollToSection("home")}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                    }}
                  >
                    CC
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      lineHeight: 1,
                      mb: 0.2,
                    }}
                  >
                    CareerCoach
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.75rem",
                      lineHeight: 1,
                      fontWeight: 500,
                    }}
                  >
                    Empowering Bangladesh's Future
                  </Typography>
                </Box>
              </LogoBox>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1, mx: 4, flexGrow: 1 }}>
                {navigationItems.map((item) => (
                  <NavButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    active={location.pathname === item.path}
                    startIcon={<item.icon sx={{ fontSize: "1.1rem" }} />}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>

              {/* User Actions */}
              <UserSection>
                {userState.isLoggedIn && (
                  <NotificationIconButton
                    onClick={handleNotificationOpen}
                    hasNotifications={unreadCount > 0}
                    aria-label={`${unreadCount} unread notifications`}
                  >
                    <NotificationBadge 
                      badgeContent={unreadCount} 
                      color="error"
                      invisible={unreadCount === 0}
                    >
                      {unreadCount > 0 ? (
                        <NotificationsActiveIcon sx={{ fontSize: "1.3rem" }} />
                      ) : (
                        <NotificationsIcon sx={{ fontSize: "1.3rem" }} />
                      )}
                    </NotificationBadge>
                  </NotificationIconButton>
                )}

                {userState.isLoggedIn ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                        Hi, {userState.userName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {userState.userType === "admin" ? "Administrator" : "Member"}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={handleProfileMenuOpen} 
                      sx={{ 
                        p: 0.5,
                        "&:hover": {
                          backgroundColor: "transparent",
                          transform: "scale(1.05)",
                        }
                      }}
                    >
                      <StyledAvatar>
                        {userState.userName?.charAt(0)?.toUpperCase()}
                      </StyledAvatar>
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      onClick={onLoginClick}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      onClick={onRegisterClick}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                )}

                {/* Mobile Menu Button */}
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenuOpen}
                  sx={{ 
                    display: { lg: "none" },
                    ml: 1,
                    p: 1.5,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </UserSection>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>

      {/* Profile Menu */}
      <StyledMenu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {userState.userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userState.userType === "admin" ? "Administrator" : "Member"}
          </Typography>
        </Box>
        <Divider sx={{ mx: 1 }} />
        <StyledMenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/settings" onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </StyledMenuItem>
        <Divider sx={{ mx: 1 }} />
        <StyledMenuItem onClick={onLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: "error.main" }} />
        </StyledMenuItem>
      </StyledMenu>

      {/* Mobile Menu */}
      <StyledMenu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton size="small" onClick={handleMobileMenuClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mx: 1 }} />
        
        {navigationItems.map((item) => (
          <StyledMenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMobileMenuClose}
          >
            <ListItemIcon>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </StyledMenuItem>
        ))}

        {!userState.isLoggedIn && (
          <>
            <Divider sx={{ mx: 1, my: 1 }} />
            <StyledMenuItem onClick={onLoginClick}>
              <ListItemText primary="Login" />
            </StyledMenuItem>
            <StyledMenuItem onClick={onRegisterClick}>
              <ListItemText primary="Register" />
            </StyledMenuItem>
          </>
        )}

        {userState.isLoggedIn && (
          <>
            <Divider sx={{ mx: 1, my: 1 }} />
            <StyledMenuItem onClick={onLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: "error.main" }} />
            </StyledMenuItem>
          </>
        )}
      </StyledMenu>

      {/* Enhanced Notifications Menu */}
      <StyledMenu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          style: { maxHeight: 400, overflow: 'auto' }
        }}
      >
        {/* Notification Header */}
        <Box sx={{ 
          px: 2, 
          py: 1.5, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={markAllAsRead}
              sx={{ 
                fontSize: "0.7rem", 
                minWidth: "auto",
                px: 1,
                py: 0.5,
                textTransform: "none"
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationMenuItem 
              key={notification.id} 
              unread={notification.unread}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box sx={{ width: "100%", pr: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: notification.unread ? 600 : 400,
                      color: notification.unread ? "text.primary" : "text.secondary",
                      pr: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {notification.title}
                  </Typography>
                  {notification.unread && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        flexShrink: 0,
                        mt: 0.5
                      }}
                    />
                  )}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "text.secondary", 
                    display: "block",
                    mb: 0.5,
                    lineHeight: 1.3
                  }}
                >
                  {notification.description}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "text.disabled",
                    fontSize: "0.7rem"
                  }}
                >
                  {notification.time}
                </Typography>
              </Box>
            </NotificationMenuItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <NotificationsIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
        
        {notifications.length > 0 && (
          <>
            <Divider sx={{ mx: 1, my: 1 }} />
            <StyledMenuItem sx={{ justifyContent: "center", py: 1.5 }}>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                View All Notifications
              </Typography>
            </StyledMenuItem>
          </>
        )}
      </StyledMenu>
    </>
  );
};

export default Navbar;