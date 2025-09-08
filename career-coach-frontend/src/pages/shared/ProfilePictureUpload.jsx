import React, { useState, useRef } from "react";
import { userAPI } from "../../services/api";
import { getFullImageUrl } from "../../utils/imageUtils";

const ProfilePictureUpload = ({
  currentImage,
  onImageUpdate,
  size = 120,
  editable = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setShowPreviewDialog(true);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to upload profile picture");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      console.log(
        "Uploading file:",
        selectedFile.name,
        "Size:",
        selectedFile.size
      );
      const response = await userAPI.uploadProfilePicture(formData);

      console.log("Upload response:", response.data);

      if (response.data && response.data.profilePictureUrl) {
        onImageUpdate(response.data.profilePictureUrl);
        setShowPreviewDialog(false);
        setPreviewImage(null);
        setSelectedFile(null);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else if (error.response?.status === 403) {
        setError("Access denied. Please check your permissions.");
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUpdate(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const cancelPreview = () => {
    setShowPreviewDialog(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setError("");
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  // Reset image error when currentImage changes
  React.useEffect(() => {
    setImageLoadError(false);
  }, [currentImage]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Picture Display */}
      <div className="relative">
        <div
          className={`rounded-full border-4 border-blue-500 shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center`}
          style={{ width: size, height: size }}
        >
          {currentImage && !imageLoadError ? (
            <img
              src={getFullImageUrl(currentImage)}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <svg
              className="text-gray-400"
              style={{ fontSize: size * 0.4 }}
              fill="currentColor"
              viewBox="0 0 24 24"
              width={size * 0.4}
              height={size * 0.4}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>

        {editable && (
          <button
            onClick={triggerFileInput}
            className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        )}
      </div>

      {/* Upload Controls */}
      {editable && (
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={triggerFileInput}
            className="px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            {currentImage ? "Change Photo" : "Upload Photo"}
          </button>

          {currentImage && (
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Remove
            </button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full max-w-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Preview Dialog */}
      {showPreviewDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Preview Profile Picture
            </h3>

            <div className="flex flex-col items-center gap-4">
              {previewImage && (
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedFile && (
                <p className="text-sm text-gray-600 text-center">
                  File: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full">
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelPreview}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
