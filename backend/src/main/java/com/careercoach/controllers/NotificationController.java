package com.careercoach.controllers;

import com.careercoach.models.Notification;
import com.careercoach.models.NotificationType;
import com.careercoach.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications for the authenticated user with pagination
     */
    @GetMapping
    public ResponseEntity<Page<Notification>> getUserNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            String userId = authentication.getName();
            Page<Notification> notifications = notificationService.getUserNotifications(userId, page, size);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all notifications for the authenticated user (without pagination)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllUserNotifications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<Notification> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching all notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unread notifications for the authenticated user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<Notification> notifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching unread notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount(Authentication authentication) {
        try {
            String userId = authentication.getName();
            long count = notificationService.getUnreadNotificationCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            log.error("Error fetching unread notification count: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent notifications (last 24 hours)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Notification>> getRecentNotifications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<Notification> notifications = notificationService.getRecentNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching recent notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get active (non-expired) notifications
     */
    @GetMapping("/active")
    public ResponseEntity<List<Notification>> getActiveNotifications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            List<Notification> notifications = notificationService.getActiveNotifications(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching active notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get notifications by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(
            Authentication authentication,
            @PathVariable NotificationType type) {
        
        try {
            String userId = authentication.getName();
            List<Notification> notifications = notificationService.getNotificationsByType(userId, type);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications by type: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            Authentication authentication,
            @PathVariable String notificationId) {
        
        try {
            String userId = authentication.getName();
            boolean success = notificationService.markAsRead(notificationId, userId);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Notification not found or access denied"));
            }
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Mark a notification as dismissed
     */
    @PutMapping("/{notificationId}/dismiss")
    public ResponseEntity<Map<String, String>> markAsDismissed(
            Authentication authentication,
            @PathVariable String notificationId) {
        
        try {
            String userId = authentication.getName();
            boolean success = notificationService.markAsDismissed(notificationId, userId);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Notification dismissed"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Notification not found or access denied"));
            }
        } catch (Exception e) {
            log.error("Error dismissing notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        try {
            String userId = authentication.getName();
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        } catch (Exception e) {
            log.error("Error marking all notifications as read: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            Authentication authentication,
            @PathVariable String notificationId) {
        
        try {
            String userId = authentication.getName();
            boolean success = notificationService.deleteNotification(notificationId, userId);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Notification deleted"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Notification not found or access denied"));
            }
        } catch (Exception e) {
            log.error("Error deleting notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Create a test notification (for development/testing purposes)
     */
    @PostMapping("/test")
    public ResponseEntity<Notification> createTestNotification(
            Authentication authentication,
            @RequestBody @Valid TestNotificationRequest request) {
        
        try {
            String userId = authentication.getName();
            Notification notification = notificationService.createNotification(
                userId,
                request.getType(),
                request.getTitle(),
                request.getMessage(),
                request.getPriority(),
                request.getMetadata()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            log.error("Error creating test notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DTO for test notification creation
     */
    public static class TestNotificationRequest {
        private NotificationType type;
        private String title;
        private String message;
        private String priority;
        private Map<String, Object> metadata;

        // Getters and setters
        public NotificationType getType() { return type; }
        public void setType(NotificationType type) { this.type = type; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }
}