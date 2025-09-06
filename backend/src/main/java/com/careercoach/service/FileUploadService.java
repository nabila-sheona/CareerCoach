package com.careercoach.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.upload.max-file-size:5242880}") // 5MB default
    private long maxFileSize;
    
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    );
    
    /**
     * Upload profile picture with validation
     */
    public String uploadProfilePicture(MultipartFile file, String userId) throws IOException {
        // Validate file
        validateFile(file);
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "profile-pictures");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = "profile_" + userId + "_" + UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return relative path for storing in database
        return "/uploads/profile-pictures/" + uniqueFilename;
    }
    
    /**
     * Upload CV file with validation
     */
    public String uploadCV(MultipartFile file, String userId) throws IOException {
        // Validate CV file
        validateCVFile(file);
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "cvs");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = "cv_" + userId + "_" + UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return relative path for storing in database
        return "/uploads/cvs/" + uniqueFilename;
    }
    
    /**
     * Delete file from storage
     */
    public boolean deleteFile(String filePath) {
        try {
            if (filePath != null && !filePath.isEmpty()) {
                // Remove leading slash and convert to system path
                String systemPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
                Path path = Paths.get(systemPath);
                
                if (Files.exists(path)) {
                    Files.delete(path);
                    return true;
                }
            }
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete file: " + filePath + ", Error: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Validate image file for profile pictures
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Check file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }
        
        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed");
        }
        
        // Check file extension
        String filename = file.getOriginalFilename();
        if (filename == null || !hasValidExtension(filename)) {
            throw new IllegalArgumentException("Invalid file extension. Only .jpg, .jpeg, .png, .gif, and .webp files are allowed");
        }
    }
    
    /**
     * Validate CV file
     */
    private void validateCVFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Check file size (allow larger size for CVs)
        long maxCVSize = maxFileSize * 2; // 10MB for CVs
        if (file.getSize() > maxCVSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxCVSize / 1024 / 1024) + "MB");
        }
        
        // Check content type for CVs
        String contentType = file.getContentType();
        List<String> allowedCVTypes = Arrays.asList(
            "application/pdf", 
            "application/msword", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        
        if (contentType == null || !allowedCVTypes.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only PDF, DOC, and DOCX files are allowed for CVs");
        }
        
        // Check file extension for CVs
        String filename = file.getOriginalFilename();
        List<String> allowedCVExtensions = Arrays.asList(".pdf", ".doc", ".docx");
        if (filename == null || !hasValidCVExtension(filename, allowedCVExtensions)) {
            throw new IllegalArgumentException("Invalid file extension. Only .pdf, .doc, and .docx files are allowed");
        }
    }
    
    /**
     * Check if filename has valid image extension
     */
    private boolean hasValidExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }
    
    /**
     * Check if filename has valid CV extension
     */
    private boolean hasValidCVExtension(String filename, List<String> allowedExtensions) {
        String extension = getFileExtension(filename).toLowerCase();
        return allowedExtensions.contains(extension);
    }
    
    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        
        return filename.substring(lastDotIndex);
    }
    
    /**
     * Get file size in human readable format
     */
    public String getFileSizeString(long sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < 1024 * 1024) {
            return String.format("%.1f KB", sizeInBytes / 1024.0);
        } else {
            return String.format("%.1f MB", sizeInBytes / (1024.0 * 1024.0));
        }
    }
    
    /**
     * Check if file exists
     */
    public boolean fileExists(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        try {
            String systemPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
            Path path = Paths.get(systemPath);
            return Files.exists(path);
        } catch (Exception e) {
            return false;
        }
    }
}