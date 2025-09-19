import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import { isAuthenticated, logout } from "../utils/auth";

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

const ProfilePage = ({ onProfilePictureUpdate }) => {
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
      if (!token || !isAuthenticated()) {
        setError("Please log in to view your profile");
        if (token && !isAuthenticated()) {
          logout();
        }
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

    // Update global user state in App.js
    if (onProfilePictureUpdate) {
      onProfilePictureUpdate(imageUrl);
    }

    // Dynamically update profile completion
    const newProgress = calculateProfileCompletion(updatedProfile);
    setProfileProgress(newProgress);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <span className="block sm:inline text-sm font-medium">{error}</span>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
              onClick={() => setError("")}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg relative shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <span className="block sm:inline text-sm font-medium">{success}</span>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
              onClick={() => setSuccess("")}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Profile Completion Progress */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(profileProgress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${profileProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {profileProgress < 50 
              ? "Complete your profile to make a great first impression!" 
              : profileProgress < 80 
              ? "Great progress! Add more details to stand out." 
              : "Excellent! Your profile looks complete."
            }
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEditing ? "Edit your profile information" : "View and manage your profile"}
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    className="-ml-1 mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="-ml-1 mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Profile Picture and Basic Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <ProfilePictureUpload
                      currentImage={profile.profilePicture}
                      onImageUpdate={handleProfilePictureUpdate}
                      size={128}
                      editable={isEditing}
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {profile.name || "Your Name"}
                    </h2>
                    <p className="text-gray-600 font-medium">
                      {profile.jobTitle || "Job Title"}
                    </p>
                    {profile.company && (
                      <p className="text-gray-500 text-sm">
                        at {profile.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                          touched.name && errors.name
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {touched.name && errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                          touched.phone && errors.phone
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {touched.phone && errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profile.dateOfBirth || ""}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        onBlur={() => handleBlur("dateOfBirth")}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                          touched.dateOfBirth && errors.dateOfBirth
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                      {touched.dateOfBirth && errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={profile.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors resize-none"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={profile.jobTitle || ""}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    onBlur={() => handleBlur("jobTitle")}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                      touched.jobTitle && errors.jobTitle
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="e.g., Software Engineer, Product Manager"
                  />
                  {touched.jobTitle && errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profile.company || ""}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    onBlur={() => handleBlur("company")}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                      touched.company && errors.company
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter your company name"
                  />
                  {touched.company && errors.company && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.company}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={profile.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    onBlur={() => handleBlur("bio")}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors resize-none ${
                      touched.bio && errors.bio
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Write a brief description about yourself, your expertise, and what you're passionate about..."
                  />
                  {touched.bio && errors.bio && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.bio}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {profile.bio ? profile.bio.length : 0} characters
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience
                  </label>
                  <textarea
                    value={profile.experience || ""}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    onBlur={() => handleBlur("experience")}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors resize-none ${
                      touched.experience && errors.experience
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Describe your work experience, key projects, achievements, and responsibilities..."
                  />
                  {touched.experience && errors.experience && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.experience}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <textarea
                    value={profile.education || ""}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    onBlur={() => handleBlur("education")}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors resize-none ${
                      touched.education && errors.education
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Describe your educational background, degrees, institutions, and relevant coursework..."
                  />
                  {touched.education && errors.education && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.education}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills & Expertise
              </h3>
              
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-sm">No skills added yet</p>
                </div>
              )}
              
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Add a new skill (e.g., React, Python, Project Management)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Certifications & Achievements
              </h3>
              
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm"
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {cert}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveCertification(cert)}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-sm">No certifications added yet</p>
                </div>
              )}
              
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddCertification()}
                    placeholder="Add a certification (e.g., AWS Certified, PMP, Google Analytics)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <button
                    onClick={handleAddCertification}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Certification
                  </button>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Social & Professional Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={profile.linkedinUrl || ""}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    onBlur={() => handleBlur("linkedinUrl")}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                      touched.linkedinUrl && errors.linkedinUrl
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {touched.linkedinUrl && errors.linkedinUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.linkedinUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={profile.githubUrl || ""}
                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                    onBlur={() => handleBlur("githubUrl")}
                    disabled={!isEditing}
                    placeholder="https://github.com/yourusername"
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${
                      touched.githubUrl && errors.githubUrl
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {touched.githubUrl && errors.githubUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.githubUrl}
                    </p>
                  )}
                </div>
              </div>
              
              {(profile.linkedinUrl || profile.githubUrl) && !isEditing && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                      LinkedIn Profile
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub Profile
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Keep your profile updated to make the best impression with potential employers and connections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;