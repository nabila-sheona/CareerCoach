package com.careercoach.service;

import com.careercoach.models.User;
import com.careercoach.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }

        // Hash the password before saving (only encode once here)
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        
        // Set metadata
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setProfileCompleted(false);

        // Save user to MongoDB
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public User getProfile(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User userProfile = user.get();
            // Don't return password in profile
            userProfile.setPassword(null);
            return userProfile;
        }
        throw new RuntimeException("User not found");
    }
    
    public User updateProfile(String email, User profileData) {
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User existingUser = existingUserOpt.get();
        
        // Update profile fields (keep existing password and email)
        if (profileData.getName() != null) existingUser.setName(profileData.getName());
        if (profileData.getPhone() != null) existingUser.setPhone(profileData.getPhone());
        if (profileData.getAddress() != null) existingUser.setAddress(profileData.getAddress());
        if (profileData.getBio() != null) existingUser.setBio(profileData.getBio());
        if (profileData.getSkills() != null) existingUser.setSkills(profileData.getSkills());
        if (profileData.getExperience() != null) existingUser.setExperience(profileData.getExperience());
        if (profileData.getEducation() != null) existingUser.setEducation(profileData.getEducation());
        if (profileData.getDateOfBirth() != null) existingUser.setDateOfBirth(profileData.getDateOfBirth());
        if (profileData.getLinkedinUrl() != null) existingUser.setLinkedinUrl(profileData.getLinkedinUrl());
        if (profileData.getGithubUrl() != null) existingUser.setGithubUrl(profileData.getGithubUrl());
        if (profileData.getJobTitle() != null) existingUser.setJobTitle(profileData.getJobTitle());
        if (profileData.getCompany() != null) existingUser.setCompany(profileData.getCompany());
        if (profileData.getLocation() != null) existingUser.setLocation(profileData.getLocation());
        if (profileData.getCertifications() != null) existingUser.setCertifications(profileData.getCertifications());
        
        // Update metadata
        existingUser.setUpdatedAt(LocalDateTime.now());
        
        // Check if profile is completed
        existingUser.setProfileCompleted(isProfileComplete(existingUser));
        
        return userRepository.save(existingUser);
    }
    
    public String updateProfilePicture(String email, String profilePictureUrl) {
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User existingUser = existingUserOpt.get();
        existingUser.setProfilePicture(profilePictureUrl);
        existingUser.setUpdatedAt(LocalDateTime.now());
        existingUser.setProfileCompleted(isProfileComplete(existingUser));
        
        userRepository.save(existingUser);
        return profilePictureUrl;
    }
    
    private boolean isProfileComplete(User user) {
        return user.getName() != null && !user.getName().trim().isEmpty() &&
               user.getPhone() != null && !user.getPhone().trim().isEmpty() &&
               user.getBio() != null && !user.getBio().trim().isEmpty() &&
               user.getSkills() != null && !user.getSkills().isEmpty() &&
               user.getExperience() != null && !user.getExperience().trim().isEmpty() &&
               user.getEducation() != null && !user.getEducation().trim().isEmpty();
    }
}