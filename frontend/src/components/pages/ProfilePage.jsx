import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import ProfilePictureUpload from '../shared/ProfilePictureUpload';
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
  validateSkills
} from '../../utils/profileValidation';

const ProfilePage = () => {
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
      setError('');
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }
      
      const response = await userAPI.getProfile();
      
      // Handle different response structures
      if (response.data && response.data.success) {
        setProfile(response.data.user || response.data.data || {});
      } else if (response.data) {
        setProfile(response.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load profile data. Please try again.');
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
      console.error('Failed to fetch progress:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
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
      
      await userAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setErrors({});
      setTouched({});
      fetchProgress();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
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
      case 'location':
        error = validateLocation(profile[field]);
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
    setProfile(prev => ({
      ...prev,
      profilePicture: imageUrl
    }));
    setSuccess('Profile picture updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{success}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccess('')}
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        )}

        {/* Profile Completion Progress */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Completion</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${profileProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(profileProgress)}% complete</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center">
                  <ProfilePictureUpload
                    currentImage={profile.profilePicture}
                    onImageUpdate={handleProfilePictureUpdate}
                    size={128}
                    editable={isEditing}
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{profile.name || 'Your Name'}</h2>
                  <p className="text-gray-600">{profile.jobTitle || 'Job Title'}</p>
                  <p className="text-gray-500">{profile.company || 'Company'}</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                        touched.name && errors.name
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={profile.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      onBlur={() => handleBlur('dateOfBirth')}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                        touched.dateOfBirth && errors.dateOfBirth
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {touched.dateOfBirth && errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={profile.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={profile.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    onBlur={() => handleBlur('jobTitle')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.jobTitle && errors.jobTitle
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.jobTitle && errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={profile.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onBlur={() => handleBlur('company')}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.company && errors.company
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.company && errors.company && (
                    <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    onBlur={() => handleBlur('bio')}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.bio && errors.bio
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.bio && errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <textarea
                    value={profile.experience || ''}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    onBlur={() => handleBlur('experience')}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Describe your work experience..."
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.experience && errors.experience
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.experience && errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <textarea
                    value={profile.education || ''}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    onBlur={() => handleBlur('education')}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Describe your educational background..."
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.education && errors.education
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.education && errors.education && (
                    <p className="mt-1 text-sm text-red-600">{errors.education}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.certifications?.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {cert}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveCertification(cert)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                    placeholder="Add a certification"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddCertification}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={profile.linkedinUrl || ''}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    onBlur={() => handleBlur('linkedinUrl')}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.linkedinUrl && errors.linkedinUrl
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.linkedinUrl && errors.linkedinUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={profile.githubUrl || ''}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    onBlur={() => handleBlur('githubUrl')}
                    disabled={!isEditing}
                    placeholder="https://github.com/yourusername"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 ${
                      touched.githubUrl && errors.githubUrl
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {touched.githubUrl && errors.githubUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;