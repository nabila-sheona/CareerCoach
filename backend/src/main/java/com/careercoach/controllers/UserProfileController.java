package com.careercoach.controllers;

import com.careercoach.models.User;
import com.careercoach.service.UserService;
import com.careercoach.service.FileUploadService;
import com.careercoach.utility.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            // Extract email from JWT token
            String jwtToken = token.replace("Bearer ", "");
            String email = jwtTokenUtil.getUsernameFromToken(jwtToken);
            
            if (email == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid token"
                ));
            }

            User userProfile = userService.getProfile(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", userProfile);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to get profile: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody User profileData) {
        try {
            // Extract email from JWT token
            String jwtToken = token.replace("Bearer ", "");
            String email = jwtTokenUtil.getUsernameFromToken(jwtToken);
            
            if (email == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid token"
                ));
            }

            User updatedUser = userService.updateProfile(email, profileData);
            // Remove password from response
            updatedUser.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to update profile: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("profilePicture") MultipartFile file,
            @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from token
            String jwt = token.substring(7);
            String email = jwtTokenUtil.getUsernameFromToken(jwt);
            
            // Get user to get user ID
            User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Upload profile picture using FileUploadService
            String profilePictureUrl = fileUploadService.uploadProfilePicture(file, user.getId().toString());
            
            // Update user profile picture
            String updatedUrl = userService.updateProfilePicture(email, profilePictureUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile picture uploaded successfully");
            response.put("profilePictureUrl", updatedUrl);
            response.put("fileSize", fileUploadService.getFileSizeString(file.getSize()));
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload profile picture: " + e.getMessage()));
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress(@RequestHeader("Authorization") String token) {
        try {
            // Extract email from JWT token
            String jwtToken = token.replace("Bearer ", "");
            String email = jwtTokenUtil.getUsernameFromToken(jwtToken);
            
            if (email == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid token"
                ));
            }

            User user = userService.getProfile(email);
            
            // Calculate profile completion percentage
            int totalFields = 8; // name, phone, bio, skills, experience, education, profilePicture, dateOfBirth
            int completedFields = 0;
            
            if (user.getName() != null && !user.getName().trim().isEmpty()) completedFields++;
            if (user.getPhone() != null && !user.getPhone().trim().isEmpty()) completedFields++;
            if (user.getBio() != null && !user.getBio().trim().isEmpty()) completedFields++;
            if (user.getSkills() != null && !user.getSkills().isEmpty()) completedFields++;
            if (user.getExperience() != null && !user.getExperience().trim().isEmpty()) completedFields++;
            if (user.getEducation() != null && !user.getEducation().trim().isEmpty()) completedFields++;
            if (user.getProfilePicture() != null && !user.getProfilePicture().trim().isEmpty()) completedFields++;
            if (user.getDateOfBirth() != null) completedFields++;
            
            int completionPercentage = (completedFields * 100) / totalFields;
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("completionPercentage", completionPercentage);
            response.put("completedFields", completedFields);
            response.put("totalFields", totalFields);
            response.put("profileCompleted", user.isProfileCompleted());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to get progress: " + e.getMessage()
            ));
        }
    }
}