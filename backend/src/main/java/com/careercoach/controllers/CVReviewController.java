package com.careercoach.controllers;

import com.careercoach.models.CVReview;
import com.careercoach.service.CVReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    // Create a new CV review
    @PostMapping
    public ResponseEntity<CVReview> createCVReview(@RequestBody CVReview cvReview) {
        try {
            CVReview savedReview = cvReviewService.saveCVReview(cvReview);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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

    // Get reviews within a date range
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