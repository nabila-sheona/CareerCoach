import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  ContentPaste as ContentIcon,
  Security as SecurityIcon,
  Storage as DatabaseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { adminAPI } from "../../services/api";

const AdminCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Simulated API calls
        const statsResponse = {
          data: {
            totalUsers: 15432,
            activeUsers: 8431,
            testsTaken: 28765,
            interviewsCompleted: 15672,
            cvReviews: 19843,
          },
        };

        const usersResponse = {
          data: [
            {
              id: 1,
              name: "Arif Rahman",
              email: "arif@example.com",
              joined: "2 days ago",
              status: "active",
            },
            {
              id: 2,
              name: "Sadia Fatima",
              email: "sadia@example.com",
              joined: "3 days ago",
              status: "active",
            },
            {
              id: 3,
              name: "Mahmud Hasan",
              email: "mahmud@example.com",
              joined: "5 days ago",
              status: "inactive",
            },
          ],
        };

        const statusResponse = {
          data: {
            database: "online",
            api: "online",
            aiServices: "online",
            storage: "online",
            uptime: "99.9%",
          },
        };

        setStats(statsResponse.data);
        setRecentUsers(usersResponse.data);
        setSystemStatus(statusResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const adminFeatures = [
    {
      icon: <UsersIcon />,
      title: "User Management",
      description:
        "Manage registered users, view activity logs, and handle user permissions.",
      color: "primary",
      action: "user-management",
    },
    {
      icon: <ContentIcon />,
      title: "Content Management",
      description:
        "Add and update test modules, interview questions, and learning resources.",
      color: "secondary",
      action: "content-management",
    },
    {
      icon: <AnalyticsIcon />,
      title: "Analytics Dashboard",
      description:
        "View platform usage statistics, success rates, and performance metrics.",
      color: "info",
      action: "analytics",
    },
    {
      icon: <SecurityIcon />,
      title: "Content Moderation",
      description:
        "Review flagged content, manage reports, and ensure platform safety.",
      color: "warning",
      action: "moderation",
    },
    {
      icon: <DatabaseIcon />,
      title: "Database Management",
      description:
        "Manage database operations, backups, and system maintenance.",
      color: "error",
      action: "database",
    },
  ];

  const handleAdminAction = (action) => {
    alert(`Admin action: ${action}`);
  };

  if (loading) {
    return (
      <Box id="admin" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <LinearProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box id="admin" sx={{ py: 10, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AdminIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h2" component="h2" fontWeight="bold">
              Admin Panel
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Manage platform content, users, and system operations
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats &&
            Object.entries(stats).map(([key, value], index) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      component="div"
                      color="primary"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {value.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textTransform="capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Admin Features */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {adminFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <AdminCard>
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Box sx={{ color: `${feature.color}.main`, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={feature.color}
                    onClick={() => handleAdminAction(feature.action)}
                  >
                    Manage
                  </Button>
                </CardContent>
              </AdminCard>
            </Grid>
          ))}
        </Grid>

        {/* Recent Users */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Users
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              color={
                                user.status === "active" ? "success" : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" color="primary">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* System Status */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  System Status
                </Typography>
                {systemStatus &&
                  Object.entries(systemStatus).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" textTransform="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </Typography>
                      <Chip
                        label={value}
                        color={
                          value === "online" || value === "99.9%"
                            ? "success"
                            : "error"
                        }
                        size="small"
                      />
                    </Box>
                  ))}
                <Alert severity="success" sx={{ mt: 2 }}>
                  All systems operational
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminPanel;
