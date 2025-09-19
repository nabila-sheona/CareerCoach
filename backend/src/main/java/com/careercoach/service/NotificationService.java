package com.careercoach.service;

import com.careercoach.models.Notification;
import com.careercoach.models.NotificationStatus;
import com.careercoach.models.NotificationType;
import com.careercoach.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create and send a new notification
     */
    public Notification createNotification(String userId, NotificationType type, String title, 
                                         String message, String priority, Map<String, Object> metadata) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .priority(priority != null ? priority : "MEDIUM")
                .metadata(metadata)
                .build();

        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendRealTimeNotification(userId, notification);
        
        log.info("Created notification for user {}: {}", userId, title);
        return notification;
    }

    /**
     * Create notification with additional parameters
     */
    public Notification createNotification(String userId, NotificationType type, String title, 
                                         String message, String priority, String relatedEntityId, 
                                         String actionUrl, LocalDateTime expiresAt, Map<String, Object> metadata) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .priority(priority != null ? priority : "MEDIUM")
                .relatedEntityId(relatedEntityId)
                .actionUrl(actionUrl)
                .expiresAt(expiresAt)
                .metadata(metadata)
                .build();

        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendRealTimeNotification(userId, notification);
        
        log.info("Created notification for user {}: {}", userId, title);
        return notification;
    }

    /**
     * Get all notifications for a user with pagination
     */
    public Page<Notification> getUserNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, NotificationStatus.UNREAD);
    }

    /**
     * Get unread notification count
     */
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }

    /**
     * Mark notification as read
     */
    public boolean markAsRead(String notificationId, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            
            // Verify the notification belongs to the user
            if (!notification.getUserId().equals(userId)) {
                log.warn("User {} attempted to mark notification {} that doesn't belong to them", userId, notificationId);
                return false;
            }
            
            notification.markAsRead();
            notificationRepository.save(notification);
            
            // Send real-time update
            sendNotificationUpdate(userId, notification);
            
            log.info("Marked notification {} as read for user {}", notificationId, userId);
            return true;
        }
        
        return false;
    }

    /**
     * Mark notification as dismissed
     */
    public boolean markAsDismissed(String notificationId, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            
            // Verify the notification belongs to the user
            if (!notification.getUserId().equals(userId)) {
                log.warn("User {} attempted to dismiss notification {} that doesn't belong to them", userId, notificationId);
                return false;
            }
            
            notification.markAsDismissed();
            notificationRepository.save(notification);
            
            // Send real-time update
            sendNotificationUpdate(userId, notification);
            
            log.info("Marked notification {} as dismissed for user {}", notificationId, userId);
            return true;
        }
        
        return false;
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        
        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        
        notificationRepository.saveAll(unreadNotifications);
        
        // Send bulk update notification
        sendBulkNotificationUpdate(userId, "ALL_READ");
        
        log.info("Marked {} notifications as read for user {}", unreadNotifications.size(), userId);
    }

    /**
     * Delete a notification
     */
    public boolean deleteNotification(String notificationId, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            
            // Verify the notification belongs to the user
            if (!notification.getUserId().equals(userId)) {
                log.warn("User {} attempted to delete notification {} that doesn't belong to them", userId, notificationId);
                return false;
            }
            
            notificationRepository.delete(notification);
            
            // Send real-time update
            sendNotificationDeletion(userId, notificationId);
            
            log.info("Deleted notification {} for user {}", notificationId, userId);
            return true;
        }
        
        return false;
    }

    /**
     * Get notifications by type
     */
    public List<Notification> getNotificationsByType(String userId, NotificationType type) {
        return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    /**
     * Get recent notifications (last 24 hours)
     */
    public List<Notification> getRecentNotifications(String userId) {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return notificationRepository.findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId, yesterday);
    }

    /**
     * Get active (non-expired) notifications
     */
    public List<Notification> getActiveNotifications(String userId) {
        return notificationRepository.findActiveNotificationsByUserId(userId, LocalDateTime.now());
    }

    /**
     * Cleanup old notifications (older than 30 days)
     */
    public void cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteByCreatedAtBefore(thirtyDaysAgo);
        log.info("Cleaned up notifications older than 30 days");
    }

    /**
     * Send real-time notification via WebSocket
     */
    private void sendRealTimeNotification(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId, 
                "/queue/notifications", 
                notification
            );
            log.debug("Sent real-time notification to user {}", userId);
        } catch (Exception e) {
            log.error("Failed to send real-time notification to user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Send notification update via WebSocket
     */
    private void sendNotificationUpdate(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId, 
                "/queue/notification-updates", 
                notification
            );
            log.debug("Sent notification update to user {}", userId);
        } catch (Exception e) {
            log.error("Failed to send notification update to user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Send bulk notification update
     */
    private void sendBulkNotificationUpdate(String userId, String action) {
        try {
            Map<String, Object> update = Map.of(
                "action", action,
                "timestamp", LocalDateTime.now()
            );
            messagingTemplate.convertAndSendToUser(
                userId, 
                "/queue/notification-updates", 
                update
            );
            log.debug("Sent bulk notification update to user {}: {}", userId, action);
        } catch (Exception e) {
            log.error("Failed to send bulk notification update to user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Send notification deletion update
     */
    private void sendNotificationDeletion(String userId, String notificationId) {
        try {
            Map<String, Object> update = Map.of(
                "action", "DELETED",
                "notificationId", notificationId,
                "timestamp", LocalDateTime.now()
            );
            messagingTemplate.convertAndSendToUser(
                userId, 
                "/queue/notification-updates", 
                update
            );
            log.debug("Sent notification deletion update to user {}", userId);
        } catch (Exception e) {
            log.error("Failed to send notification deletion update to user {}: {}", userId, e.getMessage());
        }
    }
}