import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Alert,
  Box,
  Divider,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Close as CloseIcon, Google as GoogleIcon } from "@mui/icons-material";
import { authAPI } from "../../services/api";
import { setAuthData } from "../../utils/auth";

const industries = [
  {
    value: "banking",
    label: "Banking & Finance (Bangladesh Bank, Dutch-Bangla Bank)",
  },
  { value: "tech", label: "Technology (bKash, Pathao, Shohoz)" },
  { value: "telecom", label: "Telecommunications (Grameenphone, Robi)" },
  { value: "government", label: "Government (BCS, Various Ministries)" },
  { value: "ngo", label: "NGO (BRAC, Grameen Foundation)" },
  { value: "other", label: "Other" },
];

const experienceLevels = [
  { value: "student", label: "Student/Fresh Graduate" },
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior Level (5+ years)" },
];

const RegisterModal = ({ open, onClose, onRegister, onSwitchToLogin }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    targetIndustry: "",
    experienceLevel: "",
    currentRole: "",
    targetRole: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = ["Account Details", "Career Information", "Complete Profile"];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        targetIndustry: formData.targetIndustry,
        experienceLevel: formData.experienceLevel,
        currentRole: formData.currentRole,
        targetRole: formData.targetRole,
      });

      if (response.data.success) {
        setAuthData(response.data.token, {
          email: formData.email,
          name: formData.name,
        });

        onRegister({
          email: formData.email,
          name: formData.name,
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignup = () => {
    // Implement Google OAuth here
    alert("Google signup would be implemented here");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              select
              label="Target Industry"
              name="targetIndustry"
              value={formData.targetIndustry}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            >
              {industries.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Experience Level"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            >
              {experienceLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Current Role (if any)"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Target Role"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="span" fontWeight="bold">
            Join CareerCoach
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                sign up with email
              </Typography>
            </Divider>
          </>
        )}

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}

          <DialogActions sx={{ px: 0, mt: 2 }}>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Next
                </Button>
              )}
            </Box>
          </DialogActions>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Button
              variant="text"
              size="small"
              onClick={onSwitchToLogin}
              sx={{ fontWeight: "bold" }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
