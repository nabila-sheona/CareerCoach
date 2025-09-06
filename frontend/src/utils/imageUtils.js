/**
 * Utility functions for handling image URLs
 */

// Get the backend base URL from environment or default
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Constructs the full image URL from a relative path
 * @param {string} relativePath - The relative path returned from the backend (e.g., '/uploads/profile-pictures/filename.jpg')
 * @returns {string} - The full URL to the image
 */
export const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  
  return `${BACKEND_BASE_URL}/${cleanPath}`;
};

/**
 * Validates if an image URL is accessible
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Promise that resolves to true if image is accessible
 */
export const validateImageUrl = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};