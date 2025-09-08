import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// User Data API
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (userData) => api.put("/user/profile", userData),
  getProgress: () => api.get("/user/progress"),
  uploadProfilePicture: (formData) =>
    api.post("/user/upload-profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  saveTestResult: (result) => api.post("/user/test-results", result),
  getTestHistory: () => api.get("/user/test-history"),
  uploadCV: (formData) =>
    api.post("/user/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Gemini AI API
export const geminiAPI = {
  analyzeCV: (cvText, jobRole) => {
    return api.post("/ai/cv-analysis", { cvText, jobRole });
  },
  generateQuestions: (domain, difficulty) => {
    return api.post("/ai/generate-questions", { domain, difficulty });
  },
  evaluateAnswer: (question, answer, context) => {
    return api.post("/ai/evaluate-answer", { question, answer, context });
  },
  analyzeInterview: (transcript, role) => {
    return api.post("/ai/interview-analysis", { transcript, role });
  },
  getSkillGap: (currentSkills, targetRole) => {
    return api.post("/ai/skill-gap", { currentSkills, targetRole });
  },
  generateRoadmap: (skillGaps, timeframe) => {
    return api.post("/ai/learning-roadmap", { skillGaps, timeframe });
  },
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  manageUser: (userId, action) =>
    api.post(`/admin/users/${userId}`, { action }),
  getContent: (type) => api.get(`/admin/content/${type}`),
  updateContent: (type, content) => api.put(`/admin/content/${type}`, content),
  getAnalytics: () => api.get("/admin/analytics"),
  getSystemStatus: () => api.get("/admin/system-status"),
};

// CV Review API
export const cvReviewAPI = {
  // Save CV review data
  saveCVReview: (cvReviewData) => api.post('/cv-reviews', cvReviewData),
  
  // Get comprehensive dashboard data
  getDashboardData: (userId) => api.get(`/cv-reviews/dashboard/${userId}`),
  
  // Create a new CV review
  createReview: (reviewData) => api.post("/cv-reviews", reviewData),
  
  // Get all reviews for a user
  getUserReviews: (userId) => api.get(`/cv-reviews/user/${userId}`),
  
  // Get a specific review by ID
  getReviewById: (reviewId) => api.get(`/cv-reviews/${reviewId}`),
  
  // Delete a review
  deleteReview: (reviewId) => api.delete(`/cv-reviews/${reviewId}`),
  
  // Get reviews within a date range
  getReviewsInDateRange: (userId, startDate, endDate) => 
    api.get(`/cv-reviews/user/${userId}/date-range`, {
      params: { startDate, endDate }
    }),
  
  // Get review statistics
  getReviewStatistics: (userId) => api.get(`/cv-reviews/user/${userId}/statistics`),
  
  // Get total review count
  getTotalReviewCount: (userId) => api.get(`/cv-reviews/user/${userId}/count`),
  
  // Get progress comparison
  getProgressComparison: (userId) => api.get(`/cv-reviews/user/${userId}/progress`),
  
  // Get key metrics
  getKeyMetrics: (userId) => api.get(`/cv-reviews/user/${userId}/metrics`),
  
  // Get recent feedback
  getRecentFeedback: (userId) => api.get(`/cv-reviews/user/${userId}/recent-feedback`),
  
  // Get progress trends
  getProgressTrends: (userId) => api.get(`/cv-reviews/user/${userId}/trends`)
};

export default api;
