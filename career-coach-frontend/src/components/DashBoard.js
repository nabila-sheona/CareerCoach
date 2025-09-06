import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import { TrendingUp as TrendIcon } from "@mui/icons-material";
import { userAPI } from "../services/api";

const ProgressBar = ({ label, value, color, improvement }) => (
  <Box sx={{ mb: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography variant="body2" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="body2" color={color} fontWeight="bold">
        {value}% {improvement && `(+${improvement}%)`}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: "grey.200",
        "& .MuiLinearProgress-bar": {
          backgroundColor: color,
          borderRadius: 4,
        },
      }}
    />
  </Box>
);

const Dashboard = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Simulated API call
        const progressResponse = {
          data: {
            communication: 78,
            technical: 65,
            interview: 82,
            aptitude: 89,
          },
        };
        setUserProgress(progressResponse.data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Dashboard Overview
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your career development progress
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Progress Overview */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Your Progress Journey
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <ProgressBar
                      label="Communication Skills"
                      value={userProgress?.communication || 0}
                      color="primary"
                      improvement={16}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProgressBar
                      label="Technical Skills"
                      value={userProgress?.technical || 0}
                      color="secondary"
                      improvement={23}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProgressBar
                      label="Interview Confidence"
                      value={userProgress?.interview || 0}
                      color="purple"
                      improvement={37}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProgressBar
                      label="Aptitude Score"
                      value={userProgress?.aptitude || 0}
                      color="warning"
                      improvement={27}
                    />
                  </Grid>
                </Grid>

                {/* Career Trajectory */}
                <Card
                  sx={{
                    mb: 4,
                    bgcolor: "primary.50",
                    border: "1px solid",
                    borderColor: "primary.100",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div" color="primary">
                        Career Trajectory Prediction
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      With your current progress, you could reach a{" "}
                      <strong>Senior Software Engineer</strong> role within{" "}
                      <strong>2.5 years</strong> at companies like bKash or
                      Grameenphone.
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Stats
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Tests Completed</Typography>
                    <Chip label="12" color="primary" size="small" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">CV Reviews</Typography>
                    <Chip label="3" color="secondary" size="small" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Mock Interviews</Typography>
                    <Chip label="5" color="info" size="small" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Skill Gaps Identified
                    </Typography>
                    <Chip label="8" color="warning" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
