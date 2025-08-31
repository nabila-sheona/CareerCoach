import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  LinearProgress,
  Chip,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Psychology as TestIcon,
  Mic as InterviewIcon,
  Bolt as SkillsIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { userAPI } from "../../services/api";

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  height: "100%",
}));

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
    <Typography variant="caption" color="text.secondary">
      {label === "Communication Skills" &&
        "Voice clarity improved, filler words reduced"}
      {label === "Technical Skills" && "Docker & Jenkins skills acquired"}
      {label === "Interview Confidence" &&
        "Eye contact and tone analysis improved"}
      {label === "Aptitude Score" && "Bangladesh Bank exam ready"}
    </Typography>
  </Box>
);

const Dashboard = ({ userState }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (userState.isLoggedIn) {
      // Fetch user progress and activities
      const fetchData = async () => {
        try {
          // Simulated API calls
          const progressResponse = {
            data: {
              communication: 78,
              technical: 65,
              interview: 82,
              aptitude: 89,
            },
          };

          const activitiesResponse = {
            data: [
              {
                id: 1,
                type: "test",
                title: "Banking Aptitude Test completed",
                score: 89,
                time: "2 hours ago",
              },
              {
                id: 2,
                type: "cv",
                title: "CV Review: 8 improvements suggested",
                time: "1 day ago",
              },
              {
                id: 3,
                type: "interview",
                title: "Mock Interview - DevOps Engineer role",
                time: "3 days ago",
              },
            ],
          };

          setUserProgress(progressResponse.data);
          setRecentActivities(activitiesResponse.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchData();
    }
  }, [userState.isLoggedIn]);

  const quickActions = [
    {
      icon: <UploadIcon />,
      label: "Upload CV for AI Review",
      color: "primary",
      action: "cv-upload",
    },
    {
      icon: <TestIcon />,
      label: "Take Domain-Specific Test",
      color: "secondary",
      action: "aptitude-test",
    },
    {
      icon: <InterviewIcon />,
      label: "Start AI Mock Interview",
      color: "purple",
      action: "mock-interview",
    },
    {
      icon: <SkillsIcon />,
      label: "Analyze Skill Gaps",
      color: "indigo",
      action: "skill-gap",
    },
  ];

  const handleActionClick = (action) => {
    alert(`Action: ${action}`);
  };

  if (!userState.isLoggedIn) {
    return (
      <Box id="dashboard" sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Alert severity="warning" sx={{ maxWidth: 600, mx: "auto" }}>
              Please login to access your personalized dashboard
            </Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box id="dashboard" sx={{ py: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Your Career Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your progress and access all features in one place
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={action.color}
                    startIcon={action.icon}
                    onClick={() => handleActionClick(action.action)}
                    sx={{
                      justifyContent: "flex-start",
                      py: 2,
                      textAlign: "left",
                      borderRadius: 2,
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Progress Overview */}
          <Grid item xs={12} lg={8}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom fontWeight="bold">
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
                    With your current communication (78%) and aptitude scores
                    (89%), you could reach a
                    <strong> Senior Software Engineer</strong> role within{" "}
                    <strong>2.5 years</strong>
                    at companies like bKash or Grameenphone.
                  </Typography>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Activity
                  </Typography>
                  <List>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemIcon>
                            <ScheduleIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.title}
                            secondary={activity.time}
                          />
                          {activity.score && (
                            <Chip
                              label={`${activity.score}%`}
                              color="success"
                              size="small"
                            />
                          )}
                        </ListItem>
                        {index < recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </DashboardCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
