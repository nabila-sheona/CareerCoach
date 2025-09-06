import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
} from "@mui/material";
import {
  Mic as InterviewIcon,
  Videocam as VideoIcon,
} from "@mui/icons-material";

const MockInterviews = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);

  const jobRoles = [
    { value: "software-engineer", label: "Software Engineer" },
    { value: "banking-officer", label: "Banking Officer" },
    { value: "devops-engineer", label: "DevOps Engineer" },
    { value: "data-analyst", label: "Data Analyst" },
  ];

  const handleStartInterview = () => {
    setInterviewStarted(true);
    // Here you would integrate with video/audio API
  };

  if (interviewStarted) {
    return (
      <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <VideoIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Mock Interview Session
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Role:{" "}
              <strong>
                {jobRoles.find((r) => r.value === selectedRole)?.label}
              </strong>
            </Alert>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                🎥 Camera & Microphone Check
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ensure your camera and microphone are working properly before
                starting.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setInterviewStarted(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="success">
                Start Recording
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <InterviewIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            AI Mock Interviews
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Practice interviews with AI-powered feedback and analysis
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Interview Role
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a job role to practice interview questions specific to that
              position
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Job Role</InputLabel>
              <Select
                value={selectedRole}
                label="Job Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {jobRoles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Features included:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="Voice Analysis" variant="outlined" />
                <Chip label="Filler Word Detection" variant="outlined" />
                <Chip label="Eye Contact Analysis" variant="outlined" />
                <Chip label="AI Feedback" variant="outlined" />
                <Chip label="Ideal Answers" variant="outlined" />
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!selectedRole}
              onClick={handleStartInterview}
              startIcon={<VideoIcon />}
            >
              Start Mock Interview
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default MockInterviews;
