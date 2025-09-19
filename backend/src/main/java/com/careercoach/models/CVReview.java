package com.careercoach.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "cv_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVReview {

    @Id
    private String id;

    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Job description is required")
    private String jobDescription;
    private String cvFileName;
    private String cvFilePath;
    
    // Analysis Results
    private OverallMatch overallMatch;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> missingSkills;
    private List<Recommendation> recommendations;
    private KeywordOptimization keywordOptimization;
    private FormattingFeedback formatting;
    private Suitability suitability;
    
    // Metadata
    private LocalDateTime reviewDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // COMPLETED, PENDING, FAILED
    
    // Nested Classes for structured data
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OverallMatch {
        private Integer score; // 0-100
        private String summary;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Recommendation {
        private String category;
        private String suggestion;
        private String priority; // high, medium, low
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class KeywordOptimization {
        private List<String> missingKeywords;
        private String suggestions;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormattingFeedback {
        private Integer score; // 0-10
        private String suggestions;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Suitability {
        private String verdict; // Highly Suitable, Suitable, Needs Improvement, Not Suitable
        private String reasoning;
    }
}