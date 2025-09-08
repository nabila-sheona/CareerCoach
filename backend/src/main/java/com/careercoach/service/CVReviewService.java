package com.careercoach.service;

import com.careercoach.models.CVReview;
import com.careercoach.repository.CVReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CVReviewService {

    @Autowired
    private CVReviewRepository cvReviewRepository;

    // Save a new CV review
    public CVReview saveCVReview(CVReview cvReview) {
        cvReview.setCreatedAt(LocalDateTime.now());
        cvReview.setUpdatedAt(LocalDateTime.now());
        if (cvReview.getReviewDate() == null) {
            cvReview.setReviewDate(LocalDateTime.now());
        }
        return cvReviewRepository.save(cvReview);
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