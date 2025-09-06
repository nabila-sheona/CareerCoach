import React, { useState, useEffect } from "react";
import { userAPI } from "./shared/api";
import ProfilePictureUpload from "./shared/ProfilePictureUpload";
import {
  validateProfile,
  calculateProfileCompletion,
  validateEmail,
  validatePhone,
  validateName,
  validateBio,
  validateExperience,
  validateEducation,
  validateJobTitle,
  validateCompany,
  validateLocation,
  validateLinkedInUrl,
  validateGitHubUrl,
  validateDateOfBirth,
  validateSkills,
} from "../utils/profileValidation";

// MUI imports
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    skills: [],
    experience: "",
    education: "",
    profilePicture: "",
    dateOfBirth: "",
    linkedinUrl: "",
    githubUrl: "",
    jobTitle: "",
    company: "",
    certifications: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      const response = await userAPI.getProfile();

      // Handle different response structures
      let profileData = {};
      if (response.data && response.data.success) {
        profileData = response.data.user || response.data.data || {};
      } else if (response.data) {
        profileData = response.data;
      } else {
        setError("Invalid response format from server");
        return;
      }

      // Ensure skills and certifications are arrays
      const normalizedProfile = {
        ...profileData,
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        certifications: Array.isArray(profileData.certifications)
          ? profileData.certifications
          : [],
      };

      setProfile(normalizedProfile);

      // Calculate progress after profile is loaded
      const progress = calculateProfileCompletion(normalizedProfile);
      setProfileProgress(progress);
      console.log("Profile loaded, progress calculated:", progress, "%");
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else if (err.response?.status === 403) {
        setError("Access denied. Please check your permissions.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load profile data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await userAPI.getProgress();
      setProfileProgress(response.data.profileCompletion || 0);
    } catch (err) {
      // Calculate progress locally if API fails
      const progress = calculateProfileCompletion(profile);
      setProfileProgress(progress);
      console.error("Failed to fetch progress:", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Validate all fields before saving
      const validation = validateProfile(profile);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setTouched(
          Object.keys(profile).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        setError("Please fix the validation errors before saving.");
        setSaving(false);
        return;
      }

      await userAPI.updateProfile(profile);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setErrors({});
      setTouched({});

      // Calculate progress locally after saving
      const newProgress = calculateProfileCompletion(profile);
      setProfileProgress(newProgress);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  const handleInputChange = (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    // Dynamically update profile completion
    const newProgress = calculateProfileCompletion(updatedProfile);
    setProfileProgress(newProgress);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = null;
    switch (field) {
      case "name":
        error = validateName(profile[field]);
        break;
      case "email":
        error = validateEmail(profile[field]);
        break;
      case "phone":
        error = validatePhone(profile[field]);
        break;
      case "bio":
        error = validateBio(profile[field]);
        break;
      case "experience":
        error = validateExperience(profile[field]);
        break;
      case "education":
        error = validateEducation(profile[field]);
        break;
      case "jobTitle":
        error = validateJobTitle(profile[field]);
        break;
      case "company":
        error = validateCompany(profile[field]);
        break;
      case "location":
        error = validateLocation(profile[field]);
        break;
      case "linkedinUrl":
        error = validateLinkedInUrl(profile[field]);
        break;
      case "githubUrl":
        error = validateGitHubUrl(profile[field]);
        break;
      case "dateOfBirth":
        error = validateDateOfBirth(profile[field]);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && trimmedSkill.length > 0) {
      // Ensure skills is an array and doesn't already contain the skill
      const currentSkills = Array.isArray(profile.skills) ? profile.skills : [];
      if (!currentSkills.includes(trimmedSkill)) {
        const updatedProfile = {
          ...profile,
          skills: [...currentSkills, trimmedSkill],
        };
        setProfile(updatedProfile);
        setNewSkill("");

        // Dynamically update profile completion
        const newProgress = calculateProfileCompletion(updatedProfile);
        setProfileProgress(newProgress);

        console.log(
          "Skill added:",
          trimmedSkill,
          "Total skills:",
          updatedProfile.skills.length
        );
      } else {
        console.log("Skill already exists:", trimmedSkill);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const updatedProfile = {
      ...profile,
      skills: currentSkills.filter((skill) => skill !== skillToRemove),
    };
    setProfile(updatedProfile);

    // Dynamically update profile completion
    const newProgress = calculateProfileCompletion(updatedProfile);
    setProfileProgress(newProgress);

    console.log(
      "Skill removed:",
      skillToRemove,
      "Remaining skills:",
      updatedProfile.skills.length
    );
  };

  const handleAddCertification = () => {
    const trimmedCertification = newCertification.trim();
    if (trimmedCertification && trimmedCertification.length > 0) {
      // Ensure certifications is an array and doesn't already contain the certification
      const currentCertifications = Array.isArray(profile.certifications)
        ? profile.certifications
        : [];
      if (!currentCertifications.includes(trimmedCertification)) {
        const updatedProfile = {
          ...profile,
          certifications: [...currentCertifications, trimmedCertification],
        };
        setProfile(updatedProfile);
        setNewCertification("");

        // Dynamically update profile completion
        const newProgress = calculateProfileCompletion(updatedProfile);
        setProfileProgress(newProgress);

        console.log(
          "Certification added:",
          trimmedCertification,
          "Total certifications:",
          updatedProfile.certifications.length
        );
      } else {
        console.log("Certification already exists:", trimmedCertification);
      }
    }
  };

  const handleRemoveCertification = (certToRemove) => {
    const currentCertifications = Array.isArray(profile.certifications)
      ? profile.certifications
      : [];
    const updatedProfile = {
      ...profile,
      certifications: currentCertifications.filter(
        (cert) => cert !== certToRemove
      ),
    };
    setProfile(updatedProfile);

    // Dynamically update profile completion
    const newProgress = calculateProfileCompletion(updatedProfile);
    setProfileProgress(newProgress);

    console.log(
      "Certification removed:",
      certToRemove,
      "Remaining certifications:",
      updatedProfile.certifications.length
    );
  };

  const handleProfilePictureUpdate = (imageUrl) => {
    const updatedProfile = {
      ...profile,
      profilePicture: imageUrl,
    };
    setProfile(updatedProfile);
    setSuccess("Profile picture updated successfully!");
    setTimeout(() => setSuccess(""), 3000);

    // Dynamically update profile completion
    const newProgress = calculateProfileCompletion(updatedProfile);
    setProfileProgress(newProgress);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setSuccess("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {/* Profile Completion Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Completion
          </Typography>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={profileProgress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {Math.round(profileProgress)}%
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Profile Card */}
      <Card>
        {/* Header */}
        <CardHeader
          title="My Profile"
          titleTypographyProps={{ variant: "h4", component: "h1" }}
          action={
            !isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ mr: 1 }}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Box>
            )
          }
        />

        <CardContent>
          <Grid container spacing={4}>
            {/* Profile Picture Section */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <ProfilePictureUpload
                  currentImage={profile.profilePicture}
                  onImageUpdate={handleProfilePictureUpdate}
                  size={128}
                  editable={isEditing}
                />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {profile.name || "Your Name"}
                </Typography>
                <Typography color="textSecondary">
                  {profile.jobTitle || "Job Title"}
                </Typography>
                <Typography color="textSecondary">
                  {profile.company || "Company"}
                </Typography>
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    value={profile.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    disabled={!isEditing}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={profile.email || ""}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    value={profile.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    disabled={!isEditing}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    onBlur={() => handleBlur("dateOfBirth")}
                    disabled={!isEditing}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    value={profile.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Professional Information */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  value={profile.jobTitle || ""}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                  onBlur={() => handleBlur("jobTitle")}
                  disabled={!isEditing}
                  error={touched.jobTitle && Boolean(errors.jobTitle)}
                  helperText={touched.jobTitle && errors.jobTitle}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company"
                  value={profile.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  onBlur={() => handleBlur("company")}
                  disabled={!isEditing}
                  error={touched.company && Boolean(errors.company)}
                  helperText={touched.company && errors.company}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  value={profile.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  onBlur={() => handleBlur("bio")}
                  disabled={!isEditing}
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                  multiline
                  rows={4}
                  placeholder="Tell us about yourself..."
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Experience"
                  value={profile.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  onBlur={() => handleBlur("experience")}
                  disabled={!isEditing}
                  error={touched.experience && Boolean(errors.experience)}
                  helperText={touched.experience && errors.experience}
                  multiline
                  rows={3}
                  placeholder="Describe your work experience..."
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Education"
                  value={profile.education || ""}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  onBlur={() => handleBlur("education")}
                  disabled={!isEditing}
                  error={touched.education && Boolean(errors.education)}
                  helperText={touched.education && errors.education}
                  multiline
                  rows={3}
                  placeholder="Describe your educational background..."
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Skills Section */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {profile.skills?.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={isEditing ? () => handleRemoveSkill(skill) : null}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            {isEditing && (
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add a skill"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Certifications Section */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {profile.certifications?.map((cert, index) => (
                <Chip
                  key={index}
                  label={cert}
                  onDelete={
                    isEditing ? () => handleRemoveCertification(cert) : null
                  }
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
            {isEditing && (
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddCertification()
                  }
                  placeholder="Add a certification"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddCertification}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Social Links */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Social Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="LinkedIn URL"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  onBlur={() => handleBlur("linkedinUrl")}
                  disabled={!isEditing}
                  error={touched.linkedinUrl && Boolean(errors.linkedinUrl)}
                  helperText={touched.linkedinUrl && errors.linkedinUrl}
                  placeholder="https://linkedin.com/in/yourprofile"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="GitHub URL"
                  value={profile.githubUrl || ""}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  onBlur={() => handleBlur("githubUrl")}
                  disabled={!isEditing}
                  error={touched.githubUrl && Boolean(errors.githubUrl)}
                  helperText={touched.githubUrl && errors.githubUrl}
                  placeholder="https://github.com/yourusername"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
