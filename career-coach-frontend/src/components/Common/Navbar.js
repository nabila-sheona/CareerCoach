import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { getCurrentUser, logout } from "../../utils/auth";

const Navbar = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Career Coach
        </Typography>
        {user && (
          <Box>
            <Typography variant="body1" component="span" sx={{ mr: 2 }}>
              Welcome, {user.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
