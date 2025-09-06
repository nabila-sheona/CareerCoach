package com.careercoach.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // Profile Information
    private String phone;
    private String address;
    private String bio;
    private List<String> skills;
    private String experience;
    private String education;
    private String profilePicture;
    private LocalDate dateOfBirth;
    private String linkedinUrl;
    private String githubUrl;
    
    // Additional profile fields
    private String jobTitle;
    private String company;
    private String location;
    private List<String> certifications;
    private String resume; // URL or file path to resume
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean profileCompleted;
}
