import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import { getCurrentUser } from "../utils/auth";

const Dashboard = () => {
  const user = getCurrentUser();

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Career Coach
          </Typography>
          <Typography variant="body1">
            Hello, {user?.name}! You have successfully logged in.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Email: {user?.email}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
