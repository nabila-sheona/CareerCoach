package com.careercoach.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "success_stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessStory {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Author ID is required")
    private String authorId; // Reference to User ID

    private String authorName; // Cached author name for performance
    private String authorAvatar; // Cached author avatar for performance

    private String category; // e.g., "Tech", "Banking", "Marketing"
    
    private String imageUrl; // Optional image/file URL
    private String fileUrl; // Optional document URL
    
    @Builder.Default
    private List<String> likedByUsers = new ArrayList<>(); // List of user IDs who liked this story
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
    
    @Builder.Default
    private int likesCount = 0;
    
    @Builder.Default
    private int commentsCount = 0;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Comment {
        private String id;
        private String userId;
        private String userName;
        private String userAvatar;
        private String content;
        private LocalDateTime createdAt;
    }
}