package com.careercoach.controllers;

import com.careercoach.models.CVReview;
import com.careercoach.service.CVReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cv-reviews")
@CrossOrigin(origins = "*")
public class CVReviewController {

    @Autowired
    private CVReviewService cvReviewService;

    // Get dashboard data for a user
    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardData(@PathVariable String userId) {
        try {
            Map<String, Object> dashboardData = cvReviewService.getDashboardData(userId);
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch dashboard data: " + e.getMessage()));
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CV Review Controller is working!");
    }

    // Create a new CV review
    @PostMapping("/simple-test")
    public ResponseEntity<String> simpleTest(@RequestBody Map<String, Object> testData) {
        System.out.println("DEBUG: Simple test endpoint called");
        System.out.println("DEBUG: Received data: " + testData);
        return ResponseEntity.ok("Simple test successful: " + testData.toString());
    }

    @PostMapping
    public ResponseEntity<?> createCVReview(@RequestBody CVReview cvReview) {
        try {
            System.out.println("DEBUG: CVReviewController.createCVReview called");
            System.out.println("DEBUG: Received CVReview - userId: " + (cvReview != null ? cvReview.getUserId() : "null") + 
                ", jobDescription: " + (cvReview != null ? cvReview.getJobDescription() : "null") + 
                ", status: " + (cvReview != null ? cvReview.getStatus() : "null"));
            
            // Basic validation
            if (cvReview.getUserId() == null || cvReview.getUserId().trim().isEmpty()) {
                System.out.println("ERROR: userId is null or empty");
                return ResponseEntity.badRequest().body("User ID is required");
            }
            
            if (cvReview.getJobDescription() == null || cvReview.getJobDescription().trim().isEmpty()) {
                System.out.println("ERROR: jobDescription is null or empty");
                return ResponseEntity.badRequest().body("Job description is required");
            }
            
            // Set default values if not provided
            if (cvReview.getStatus() == null) {
                cvReview.setStatus("PENDING");
            }
            
            System.out.println("DEBUG: About to call cvReviewService.saveCVReview");
            CVReview savedReview = cvReviewService.saveCVReview(cvReview);
            System.out.println("DEBUG: CVReview saved successfully with ID: " + savedReview.getId());
            
            return ResponseEntity.ok(savedReview);
            
        } catch (Exception e) {
            System.out.println("ERROR: Exception in createCVReview: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating CV review: " + e.getMessage());
        }
    }

    // Get all reviews for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CVReview>> getUserReviews(@PathVariable String userId) {
        try {
            List<CVReview> reviews = cvReviewService.getUserReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get a specific review by ID
    @GetMapping("/{reviewId}")
    public ResponseEntity<CVReview> getReviewById(@PathVariable String reviewId) {
        try {
            Optional<CVReview> review = cvReviewService.getReviewById(reviewId);
            return review.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        try {
            cvReviewService.deleteReview(reviewId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Complete a CV review (simulate the completion process)
    @PutMapping("/{reviewId}/complete")
    public ResponseEntity<?> completeCVReview(@PathVariable String reviewId) {
        try {
            System.out.println("DEBUG: CVReviewController.completeCVReview called for ID: " + reviewId);
            
            Optional<CVReview> optionalReview = cvReviewService.getReviewById(reviewId);
            if (optionalReview.isEmpty()) {
                System.out.println("ERROR: CV Review not found with ID: " + reviewId);
                return ResponseEntity.notFound().build();
            }
            
            CVReview review = optionalReview.get();
            System.out.println("DEBUG: Found CV Review - userId: " + review.getUserId() + ", status: " + review.getStatus());
            
            // Preserve the existing overall match data from the initial analysis
            // Only update if no overall match exists (shouldn't happen in normal flow)
            if (review.getOverallMatch() == null) {
                CVReview.OverallMatch overallMatch = CVReview.OverallMatch.builder()
                    .score(75) // Default fallback score if no analysis data exists
                    .summary("Your CV has been reviewed. Please check the detailed feedback below.")
                    .build();
                review.setOverallMatch(overallMatch);
            }
            review.setStatus("COMPLETED");
            review.setUpdatedAt(LocalDateTime.now());
            
            // Preserve existing feedback data from the initial analysis
            // Only add mock feedback if no existing data (shouldn't happen in normal flow)
            if (review.getStrengths() == null || review.getStrengths().isEmpty()) {
                review.setStrengths(Arrays.asList(
                    "Strong technical background",
                    "Relevant experience for the position",
                    "Good educational background"
                ));
            }
            
            if (review.getWeaknesses() == null || review.getWeaknesses().isEmpty()) {
                review.setWeaknesses(Arrays.asList(
                    "Could include more quantifiable achievements",
                    "Formatting could be improved"
                ));
            }
            
            if (review.getMissingSkills() == null || review.getMissingSkills().isEmpty()) {
                review.setMissingSkills(Arrays.asList("Additional skills assessment needed"));
            }
            
            System.out.println("DEBUG: About to save completed CV Review");
            CVReview completedReview = cvReviewService.completeCVReview(review);
            System.out.println("DEBUG: CV Review completed successfully with ID: " + completedReview.getId());
            
            return ResponseEntity.ok(completedReview);
            
        } catch (Exception e) {
            System.out.println("ERROR: Exception in completeCVReview: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error completing CV review: " + e.getMessage());
        }
    }
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<CVReview>> getReviewsInDateRange(
            @PathVariable String userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<CVReview> reviews = cvReviewService.getReviewsInDateRange(userId, start, end);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get review statistics for a user
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getReviewStatistics(@PathVariable String userId) {
        try {
            Map<String, Object> statistics = cvReviewService.getReviewStatistics(userId);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch statistics: " + e.getMessage()));
        }
    }

    // Get total review count for a user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Object>> getTotalReviewCount(@PathVariable String userId) {
        try {
            List<CVReview> reviews = cvReviewService.getUserReviews(userId);
            long totalCount = reviews.size();
            return ResponseEntity.ok(Map.of("totalReviews", totalCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch review count: " + e.getMessage()));
        }
    }

    // Get progress comparison (latest vs previous review)
    @GetMapping("/user/{userId}/progress")
    public ResponseEntity<Map<String, Object>> getProgressComparison(@PathVariable String userId) {
        try {
            Map<String, Object> dashboardData = cvReviewService.getDashboardData(userId);
            Map<String, Object> progressComparison = (Map<String, Object>) dashboardData.get("progressComparison");
            return ResponseEntity.ok(progressComparison);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch progress comparison: " + e.getMessage()));
        }
    }

    // Get key metrics for a user
    @GetMapping("/user/{userId}/metrics")
    public ResponseEntity<Map<String, Object>> getKeyMetrics(@PathVariable String userId) {
        try {
            Map<String, Object> dashboardData = cvReviewService.getDashboardData(userId);
            Map<String, Object> metrics = (Map<String, Object>) dashboardData.get("metrics");
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch metrics: " + e.getMessage()));
        }
    }

    // Get recent feedback (last 5 reviews)
    @GetMapping("/user/{userId}/recent-feedback")
    public ResponseEntity<List<CVReview>> getRecentFeedback(@PathVariable String userId) {
        try {
            Map<String, Object> dashboardData = cvReviewService.getDashboardData(userId);
            List<CVReview> recentFeedback = (List<CVReview>) dashboardData.get("recentFeedback");
            return ResponseEntity.ok(recentFeedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get progress trends over time
    @GetMapping("/user/{userId}/trends")
    public ResponseEntity<List<Map<String, Object>>> getProgressTrends(@PathVariable String userId) {
        try {
            Map<String, Object> dashboardData = cvReviewService.getDashboardData(userId);
            List<Map<String, Object>> progressTrends = (List<Map<String, Object>>) dashboardData.get("progressTrends");
            return ResponseEntity.ok(progressTrends);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}