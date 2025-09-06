// Profile validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone) => {
  // More flexible phone regex that accepts various formats:
  // +1234567890, (123) 456-7890, 123-456-7890, 123.456.7890, 123 456 7890, etc.
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
  if (!phone) return null; // Phone is optional
  
  // Remove all non-digit characters to check minimum length
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) return 'Phone number must have at least 10 digits';
  if (digitsOnly.length > 15) return 'Phone number cannot exceed 15 digits';
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  if (name.trim().length > 50) return 'Name must be less than 50 characters';
  return null;
};

export const validateBio = (bio) => {
  if (!bio) return null; // Bio is optional
  if (bio.length > 500) return 'Bio must be less than 500 characters';
  return null;
};

export const validateExperience = (experience) => {
  if (!experience) return null; // Experience is optional
  if (experience.length > 1000) return 'Experience must be less than 1000 characters';
  return null;
};

export const validateEducation = (education) => {
  if (!education) return null; // Education is optional
  if (education.length > 1000) return 'Education must be less than 1000 characters';
  return null;
};

export const validateJobTitle = (jobTitle) => {
  if (!jobTitle) return null; // Job title is optional
  if (jobTitle.length > 100) return 'Job title must be less than 100 characters';
  return null;
};

export const validateCompany = (company) => {
  if (!company) return null; // Company is optional
  if (company.length > 100) return 'Company name must be less than 100 characters';
  return null;
};

export const validateLocation = (location) => {
  if (!location) return null; // Location is optional
  if (location.length > 100) return 'Location must be less than 100 characters';
  return null;
};

export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) return null; // URLs are optional
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName}`;
  }
};

export const validateLinkedInUrl = (url) => {
  if (!url) return null;
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/;
  if (!linkedinRegex.test(url)) {
    return 'Please enter a valid LinkedIn profile URL';
  }
  return null;
};

export const validateGitHubUrl = (url) => {
  if (!url) return null;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
  if (!githubRegex.test(url)) {
    return 'Please enter a valid GitHub profile URL';
  }
  return null;
};

export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return null; // Date of birth is optional
  
  const date = new Date(dateOfBirth);
  const today = new Date();
  const minAge = 13;
  const maxAge = 120;
  
  if (isNaN(date.getTime())) return 'Please enter a valid date';
  
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  if (age < minAge) return `You must be at least ${minAge} years old`;
  if (age > maxAge) return `Please enter a valid date of birth`;
  
  return null;
};

export const validateSkills = (skills) => {
  if (!skills || skills.length === 0) return null; // Skills are optional
  
  if (skills.length > 20) return 'You can add up to 20 skills';
  
  for (const skill of skills) {
    if (!skill || skill.trim().length === 0) {
      return 'Skill names cannot be empty';
    }
    if (skill.length > 50) {
      return 'Each skill must be less than 50 characters';
    }
  }
  
  return null;
};

export const validateCertifications = (certifications) => {
  if (!certifications || certifications.length === 0) return null; // Certifications are optional
  
  if (certifications.length > 10) return 'You can add up to 10 certifications';
  
  for (const cert of certifications) {
    if (!cert || cert.trim().length === 0) {
      return 'Certification names cannot be empty';
    }
    if (cert.length > 100) {
      return 'Each certification must be less than 100 characters';
    }
  }
  
  return null;
};

// Comprehensive profile validation
export const validateProfile = (profile) => {
  const errors = {};
  
  const nameError = validateName(profile.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(profile.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(profile.phone);
  if (phoneError) errors.phone = phoneError;
  
  const bioError = validateBio(profile.bio);
  if (bioError) errors.bio = bioError;
  
  const experienceError = validateExperience(profile.experience);
  if (experienceError) errors.experience = experienceError;
  
  const educationError = validateEducation(profile.education);
  if (educationError) errors.education = educationError;
  
  const jobTitleError = validateJobTitle(profile.jobTitle);
  if (jobTitleError) errors.jobTitle = jobTitleError;
  
  const companyError = validateCompany(profile.company);
  if (companyError) errors.company = companyError;
  
  const locationError = validateLocation(profile.location);
  if (locationError) errors.location = locationError;
  
  const linkedinError = validateLinkedInUrl(profile.linkedinUrl);
  if (linkedinError) errors.linkedinUrl = linkedinError;
  
  const githubError = validateGitHubUrl(profile.githubUrl);
  if (githubError) errors.githubUrl = githubError;
  
  const dobError = validateDateOfBirth(profile.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;
  
  const skillsError = validateSkills(profile.skills);
  if (skillsError) errors.skills = skillsError;
  
  const certificationsError = validateCertifications(profile.certifications);
  if (certificationsError) errors.certifications = certificationsError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (profile) => {
  const fields = [
    'name',
    'email',
    'phone',
    'bio',
    'experience',
    'education',
    'jobTitle',
    'company',
    'location',
    'linkedinUrl',
    'githubUrl',
    'dateOfBirth',
    'profilePicture'
  ];
  
  const skillsComplete = profile.skills && profile.skills.length > 0;
  const certificationsComplete = profile.certifications && profile.certifications.length > 0;
  
  let completedFields = 0;
  const totalFields = fields.length + 2; // +2 for skills and certifications
  
  fields.forEach(field => {
    if (profile[field] && profile[field].toString().trim().length > 0) {
      completedFields++;
    }
  });
  
  if (skillsComplete) completedFields++;
  if (certificationsComplete) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
};

// Get required fields that are missing
export const getMissingRequiredFields = (profile) => {
  const requiredFields = ['name', 'email'];
  const missing = [];
  
  requiredFields.forEach(field => {
    if (!profile[field] || profile[field].toString().trim().length === 0) {
      missing.push(field);
    }
  });
  
  return missing;
};

// Real-time validation hook for forms
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = (name, value) => {
    if (validationRules[name]) {
      return validationRules[name](value);
    }
    return null;
  };
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));
    
    return isValid;
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).every(key => !errors[key])
  };
};