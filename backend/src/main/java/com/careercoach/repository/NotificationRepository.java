package com.careercoach.repository;

import com.careercoach.models.Notification;
import com.careercoach.models.NotificationStatus;
import com.careercoach.models.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Find all notifications for a specific user
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Find notifications by user ID with pagination
    Page<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    // Find unread notifications for a user
    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, NotificationStatus status);

    // Count unread notifications for a user
    long countByUserIdAndStatus(String userId, NotificationStatus status);

    // Find notifications by type for a user
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, NotificationType type);

    // Find notifications created after a specific date
    List<Notification> findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(String userId, LocalDateTime after);

    // Find notifications that are not expired
    @Query("{ 'userId': ?0, $or: [ { 'expiresAt': null }, { 'expiresAt': { $gt: ?1 } } ] }")
    List<Notification> findActiveNotificationsByUserId(String userId, LocalDateTime currentTime);

    // Delete old notifications (cleanup)
    void deleteByCreatedAtBefore(LocalDateTime before);

    // Find notifications by priority
    List<Notification> findByUserIdAndPriorityOrderByCreatedAtDesc(String userId, String priority);

    // Find notifications by related entity ID
    List<Notification> findByRelatedEntityIdOrderByCreatedAtDesc(String relatedEntityId);

    // Custom query to find recent unread notifications with high priority
    @Query("{ 'userId': ?0, 'status': 'UNREAD', 'priority': 'HIGH', 'createdAt': { $gte: ?1 } }")
    List<Notification> findRecentHighPriorityUnreadNotifications(String userId, LocalDateTime since);
}