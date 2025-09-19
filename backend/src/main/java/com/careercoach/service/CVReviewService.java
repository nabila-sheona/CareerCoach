package com.careercoach.service;

import com.careercoach.models.CVReview;
import com.careercoach.repository.CVReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CVReviewService {

    private static final Logger logger = LoggerFactory.getLogger(CVReviewService.class);

    @Autowired
    private CVReviewRepository cvReviewRepository;
    
    @Autowired
    private NotificationEventPublisher notificationEventPublisher;

    // Save a new CV review
    public CVReview saveCVReview(CVReview cvReview) {
        try {
            logger.info("DEBUG: CVReviewService.saveCVReview called");
            logger.info("DEBUG: CVReview object: " + cvReview);
            
            // Set timestamps
            LocalDateTime now = LocalDateTime.now();
            cvReview.setCreatedAt(now);
            cvReview.setUpdatedAt(now);
            if (cvReview.getReviewDate() == null) {
                cvReview.setReviewDate(now);
            }
            
            logger.info("DEBUG: About to save CVReview to repository");
            CVReview savedReview = cvReviewRepository.save(cvReview);
            logger.info("DEBUG: CVReview saved with ID: " + savedReview.getId() + ", status: " + savedReview.getStatus());
            
            // Only trigger notification if the review is completed
            // For PENDING reviews, notification will be sent when completeCVReview is called
            return savedReview;
        } catch (Exception e) {
            logger.error("ERROR: Exception in saveCVReview: " + e.getMessage(), e);
            throw e;
        }
    }

    // Complete a CV review and trigger notification
    public CVReview completeCVReview(CVReview cvReview) {
        try {
            logger.info("DEBUG: CVReviewService.completeCVReview called for userId: " + cvReview.getUserId());
            
            // Save the completed review
            CVReview savedReview = cvReviewRepository.save(cvReview);
            logger.info("DEBUG: CV Review completed and saved with ID: " + savedReview.getId());
            
            // Extract feedback and score for notification
            String feedback = "Your CV review has been completed.";
            
            if (savedReview.getOverallMatch() != null && savedReview.getOverallMatch().getSummary() != null) {
                feedback = savedReview.getOverallMatch().getSummary();
            }
            
            // Publish notification only when review is completed
            try {
                logger.info("DEBUG: About to publish CV review completed notification");
                notificationEventPublisher.publishCvReviewCompleted(
                    savedReview.getUserId(),
                    savedReview.getId(),
                    "Career Coach System", // reviewerName
                    feedback
                );
                logger.info("DEBUG: CV review completed notification published successfully for ID: " + savedReview.getId());
            } catch (Exception e) {
                logger.error("ERROR: Failed to publish CV review notification: " + e.getMessage(), e);
            }
            
            return savedReview;
        } catch (Exception e) {
            logger.error("ERROR: Exception in completeCVReview: " + e.getMessage(), e);
            throw e;
        }
    }

    // Get dashboard data for a user
    public Map<String, Object> getDashboardData(String userId) {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Total number of reviews
        long totalReviews = cvReviewRepository.countByUserId(userId);
        dashboardData.put("totalReviews", totalReviews);
        
        // Get all reviews for the user
        List<CVReview> allReviews = cvReviewRepository.findByUserIdOrderByReviewDateDesc(userId);
        
        // Latest review
        CVReview latestReview = allReviews.isEmpty() ? null : allReviews.get(0);
        dashboardData.put("latestReview", latestReview);
        
        // Progress comparison (current vs previous review)
        Map<String, Object> progressComparison = getProgressComparison(allReviews);
        dashboardData.put("progressComparison", progressComparison);
        
        // Key metrics and trends
        Map<String, Object> metrics = calculateKeyMetrics(allReviews);
        dashboardData.put("metrics", metrics);
        
        // Recent feedback (last 5 reviews)
        List<CVReview> recentReviews = allReviews.stream()
                .limit(5)
                .collect(Collectors.toList());
        dashboardData.put("recentFeedback", recentReviews);
        
        // Progress trends over time
        List<Map<String, Object>> progressTrends = calculateProgressTrends(allReviews);
        dashboardData.put("progressTrends", progressTrends);
        
        return dashboardData;
    }

    // Compare progress between latest and previous review
    private Map<String, Object> getProgressComparison(List<CVReview> reviews) {
        Map<String, Object> comparison = new HashMap<>();
        
        if (reviews.size() < 2) {
            comparison.put("hasImprovement", false);
            comparison.put("message", "Need at least 2 reviews to compare progress");
            return comparison;
        }
        
        CVReview latest = reviews.get(0);
        CVReview previous = reviews.get(1);
        
        // Compare overall match scores
        Integer latestScore = latest.getOverallMatch() != null ? latest.getOverallMatch().getScore() : 0;
        Integer previousScore = previous.getOverallMatch() != null ? previous.getOverallMatch().getScore() : 0;
        
        int scoreDifference = latestScore - previousScore;
        boolean hasImprovement = scoreDifference > 0;
        
        comparison.put("hasImprovement", hasImprovement);
        comparison.put("scoreDifference", scoreDifference);
        comparison.put("latestScore", latestScore);
        comparison.put("previousScore", previousScore);
        
        // Generate improvement message
        String message;
        if (scoreDifference > 0) {
            message = String.format("Great progress! Your CV score improved by %d points.", scoreDifference);
        } else if (scoreDifference < 0) {
            message = String.format("Your CV score decreased by %d points. Consider reviewing the feedback.", Math.abs(scoreDifference));
        } else {
            message = "Your CV score remained the same. Keep working on the recommendations.";
        }
        comparison.put("message", message);
        
        return comparison;
    }

    // Calculate key metrics
    private Map<String, Object> calculateKeyMetrics(List<CVReview> reviews) {
        Map<String, Object> metrics = new HashMap<>();
        
        if (reviews.isEmpty()) {
            metrics.put("averageScore", 0);
            metrics.put("highestScore", 0);
            metrics.put("lowestScore", 0);
            metrics.put("totalRecommendations", 0);
            return metrics;
        }
        
        // Calculate average score
        double averageScore = reviews.stream()
                .filter(review -> review.getOverallMatch() != null && review.getOverallMatch().getScore() != null)
                .mapToInt(review -> review.getOverallMatch().getScore())
                .average()
                .orElse(0.0);
        
        // Find highest and lowest scores
        OptionalInt highestScore = reviews.stream()
                .filter(review -> review.getOverallMatch() != null && review.getOverallMatch().getScore() != null)
                .mapToInt(review -> review.getOverallMatch().getScore())
                .max();
        
        OptionalInt lowestScore = reviews.stream()
                .filter(review -> review.getOverallMatch() != null && review.getOverallMatch().getScore() != null)
                .mapToInt(review -> review.getOverallMatch().getScore())
                .min();
        
        // Count total recommendations
        int totalRecommendations = reviews.stream()
                .filter(review -> review.getRecommendations() != null)
                .mapToInt(review -> review.getRecommendations().size())
                .sum();
        
        metrics.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        metrics.put("highestScore", highestScore.orElse(0));
        metrics.put("lowestScore", lowestScore.orElse(0));
        metrics.put("totalRecommendations", totalRecommendations);
        
        return metrics;
    }

    // Calculate progress trends over time
    private List<Map<String, Object>> calculateProgressTrends(List<CVReview> reviews) {
        return reviews.stream()
                .filter(review -> review.getOverallMatch() != null && review.getOverallMatch().getScore() != null)
                .sorted(Comparator.comparing(CVReview::getReviewDate))
                .map(review -> {
                    Map<String, Object> trend = new HashMap<>();
                    trend.put("date", review.getReviewDate());
                    trend.put("score", review.getOverallMatch().getScore());
                    trend.put("reviewId", review.getId());
                    return trend;
                })
                .collect(Collectors.toList());
    }

    // Get all reviews for a user
    public List<CVReview> getUserReviews(String userId) {
        return cvReviewRepository.findByUserIdOrderByReviewDateDesc(userId);
    }

    // Get a specific review by ID
    public Optional<CVReview> getReviewById(String reviewId) {
        return cvReviewRepository.findById(reviewId);
    }

    // Delete a review
    public void deleteReview(String reviewId) {
        cvReviewRepository.deleteById(reviewId);
    }

    // Get reviews within a date range
    public List<CVReview> getReviewsInDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return cvReviewRepository.findByUserIdAndReviewDateBetweenOrderByReviewDateDesc(userId, startDate, endDate);
    }

    // Get review statistics
    public Map<String, Object> getReviewStatistics(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalReviews = cvReviewRepository.countByUserId(userId);
        long completedReviews = cvReviewRepository.countByUserIdAndStatus(userId, "COMPLETED");
        
        stats.put("totalReviews", totalReviews);
        stats.put("completedReviews", completedReviews);
        stats.put("completionRate", totalReviews > 0 ? (double) completedReviews / totalReviews * 100 : 0);
        
        return stats;
    }
}