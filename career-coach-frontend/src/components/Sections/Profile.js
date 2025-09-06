import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { userAPI } from '../../services/api';
import ProfilePictureUpload from '../Common/ProfilePictureUpload';
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
  validateLinkedInUrl,
  validateGitHubUrl,
  validateDateOfBirth,
  validateSkills
} from '../../utils/profileValidation';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
    profilePicture: '',
    dateOfBirth: '',
    linkedinUrl: '',
    githubUrl: '',
    jobTitle: '',
    company: '',
    certifications: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [profileProgress, setProfileProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchProgress();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile data');
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
      console.error('Failed to fetch progress:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Validate all fields before saving
    const validation = validateProfile(profile);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched(Object.keys(profile).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}));
      setError('Please fix the validation errors before saving.');
      setSaving(false);
      return;
    }

    try {
      await userAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setErrors({});
      setTouched({});
      fetchProgress(); // Refresh progress after update
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = null;
    switch (field) {
      case 'name':
        error = validateName(profile[field]);
        break;
      case 'email':
        error = validateEmail(profile[field]);
        break;
      case 'phone':
        error = validatePhone(profile[field]);
        break;
      case 'bio':
        error = validateBio(profile[field]);
        break;
      case 'experience':
        error = validateExperience(profile[field]);
        break;
      case 'education':
        error = validateEducation(profile[field]);
        break;
      case 'jobTitle':
        error = validateJobTitle(profile[field]);
        break;
      case 'company':
        error = validateCompany(profile[field]);
        break;
      case 'linkedinUrl':
        error = validateLinkedInUrl(profile[field]);
        break;
      case 'githubUrl':
        error = validateGitHubUrl(profile[field]);
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(profile[field]);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !profile.certifications.includes(newCertification.trim())) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certToRemove) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleProfilePictureUpdate = (imageUrl) => {
    setProfile(prev => ({ ...prev, profilePicture: imageUrl }));
    setSuccess('Profile picture updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath;
    return `http://localhost:8080${relativePath}`;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      {/* Profile Completion Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Completion
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={profileProgress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {`${Math.round(profileProgress)}%`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          {!isEditing ? (
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
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ mr: 1 }}
              >
                {saving ? 'Saving...' : 'Save'}
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
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfilePictureUpload
                currentImage={getFullImageUrl(profile.profilePicture)}
                onImageUpdate={handleProfilePictureUpdate}
                size={150}
                editable={isEditing}
                fallbackText={profile.name?.charAt(0)?.toUpperCase()}
              />
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
                  fullWidth
                  label="Full Name"
                  value={profile.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={!isEditing}
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  disabled={!isEditing}
                  error={touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profile.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  onBlur={() => handleBlur('dateOfBirth')}
                  disabled={!isEditing}
                  error={touched.dateOfBirth && !!errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profile.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={profile.jobTitle || ''}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  onBlur={() => handleBlur('jobTitle')}
                  disabled={!isEditing}
                  error={touched.jobTitle && !!errors.jobTitle}
                  helperText={touched.jobTitle && errors.jobTitle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profile.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  onBlur={() => handleBlur('company')}
                  disabled={!isEditing}
                  error={touched.company && !!errors.company}
                  helperText={touched.company && errors.company}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  onBlur={() => handleBlur('bio')}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                  placeholder="Tell us about yourself..."
                  error={touched.bio && !!errors.bio}
                  helperText={touched.bio && errors.bio}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Experience"
                  value={profile.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  onBlur={() => handleBlur('experience')}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  placeholder="Describe your work experience..."
                  error={touched.experience && !!errors.experience}
                  helperText={touched.experience && errors.experience}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Education"
                  value={profile.education || ''}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  onBlur={() => handleBlur('education')}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  placeholder="Describe your educational background..."
                  error={touched.education && !!errors.education}
                  helperText={touched.education && errors.education}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ mb: 2 }}>
              {profile.skills?.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSkill}
                >
                  Add
                </Button>
              </Box>
            )}
          </Grid>

          {/* Certifications Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Box sx={{ mb: 2 }}>
              {profile.certifications?.map((cert, index) => (
                <Chip
                  key={index}
                  label={cert}
                  onDelete={isEditing ? () => handleRemoveCertification(cert) : undefined}
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined}
                  sx={{ mr: 1, mb: 1 }}
                  color="secondary"
                />
              ))}
            </Box>
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Certification"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddCertification}
                >
                  Add
                </Button>
              </Box>
            )}
          </Grid>

          {/* Social Links */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Social Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  onBlur={() => handleBlur('linkedinUrl')}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={touched.linkedinUrl && !!errors.linkedinUrl}
                  helperText={touched.linkedinUrl && errors.linkedinUrl}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub URL"
                  value={profile.githubUrl || ''}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  onBlur={() => handleBlur('githubUrl')}
                  disabled={!isEditing}
                  placeholder="https://github.com/yourusername"
                  error={touched.githubUrl && !!errors.githubUrl}
                  helperText={touched.githubUrl && errors.githubUrl}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;