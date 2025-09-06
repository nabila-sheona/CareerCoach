import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PhotoCamera,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { userAPI } from '../../services/api';

const ProfilePictureUpload = ({ 
  currentImage, 
  onImageUpdate, 
  size = 120, 
  editable = true 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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
    setError('');
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await userAPI.uploadProfilePicture(formData);
      
      if (response.data.profilePictureUrl) {
        onImageUpdate(response.data.profilePictureUrl);
        setShowPreviewDialog(false);
        setPreviewImage(null);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.error || 'Failed to upload image');
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
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Profile Picture Display */}
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={currentImage}
          sx={{ 
            width: size, 
            height: size,
            border: '3px solid',
            borderColor: 'primary.main',
            boxShadow: 2
          }}
        >
          {!currentImage && <PhotoCamera sx={{ fontSize: size * 0.4 }} />}
        </Avatar>
        
        {editable && (
          <IconButton
            onClick={triggerFileInput}
            sx={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              boxShadow: 2
            }}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Upload Controls */}
      {editable && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={triggerFileInput}
            size="small"
          >
            {currentImage ? 'Change Photo' : 'Upload Photo'}
          </Button>
          
          {currentImage && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveImage}
              size="small"
            >
              Remove
            </Button>
          )}
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 300 }}>
          {error}
        </Alert>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Preview Dialog */}
      <Dialog 
        open={showPreviewDialog} 
        onClose={cancelPreview}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Preview Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {previewImage && (
              <Avatar
                src={previewImage}
                sx={{ width: 200, height: 200, boxShadow: 2 }}
              />
            )}
            
            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
            
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelPreview} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={uploading || !selectedFile}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePictureUpload;