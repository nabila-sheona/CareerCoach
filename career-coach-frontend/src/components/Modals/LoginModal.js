import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Google as GoogleIcon } from "@mui/icons-material";
import { authAPI } from "../../services/api";
import { setAuthData } from "../../utils/auth";

const LoginModal = ({ open, onClose, onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setAuthData(response.data.token, {
          email: formData.email,
          name: response.data.user?.name,
          isAdmin: formData.isAdmin,
        });

        onLogin({
          email: formData.email,
          name: response.data.user?.name,
          isAdmin: formData.isAdmin,
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth here
    alert("Google login would be implemented here");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="span" fontWeight="bold">
            Login to CareerCoach
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mb: 3 }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or continue with email
          </Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                disabled={loading}
              />
            }
            label="Login as Admin"
            sx={{ mb: 2 }}
          />

          <DialogActions sx={{ px: 0 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </DialogActions>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Button
              variant="text"
              size="small"
              onClick={onSwitchToRegister}
              sx={{ fontWeight: "bold" }}
            >
              Sign up here
            </Button>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
