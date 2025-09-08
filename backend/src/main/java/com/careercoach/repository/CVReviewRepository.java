package com.careercoach.repository;

import com.careercoach.models.CVReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CVReviewRepository extends MongoRepository<CVReview, String> {
    
    // Find all reviews for a specific user
    List<CVReview> findByUserIdOrderByReviewDateDesc(String userId);
    
    // Count total reviews for a user
    long countByUserId(String userId);
    
    // Find reviews within a date range for a user
    List<CVReview> findByUserIdAndReviewDateBetweenOrderByReviewDateDesc(
        String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find latest review for a user
    CVReview findTopByUserIdOrderByReviewDateDesc(String userId);
    
    // Find reviews by status for a user
    List<CVReview> findByUserIdAndStatusOrderByReviewDateDesc(String userId, String status);
    
    // Custom query to get average scores for a user
    @Query("{ 'userId': ?0, 'overallMatch.score': { $exists: true } }")
    List<CVReview> findByUserIdWithScores(String userId);
    
    // Find recent reviews (last N reviews) for a user
    List<CVReview> findTop10ByUserIdOrderByReviewDateDesc(String userId);
    
    // Count reviews by status for a user
    long countByUserIdAndStatus(String userId, String status);
}