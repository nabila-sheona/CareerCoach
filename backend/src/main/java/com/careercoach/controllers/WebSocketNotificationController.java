package com.careercoach.controllers;

import com.careercoach.models.Notification;
import com.careercoach.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationController {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handle client subscription to notifications
     */
    @MessageMapping("/notifications/subscribe")
    @SendToUser("/queue/notifications")
    public List<Notification> subscribeToNotifications(Principal principal) {
        String userId = principal.getName();
        log.info("User {} subscribed to notifications", userId);
        
        // Send current unread notifications to the newly connected user
        return notificationService.getUnreadNotifications(userId);
    }

    /**
     * Handle notification read status update via WebSocket
     */
    @MessageMapping("/notifications/mark-read")
    public void markNotificationAsRead(@Payload Map<String, String> payload, Principal principal) {
        String userId = principal.getName();
        String notificationId = payload.get("notificationId");
        
        if (notificationId != null) {
            boolean success = notificationService.markAsRead(notificationId, userId);
            
            if (success) {
                log.info("Marked notification {} as read for user {} via WebSocket", notificationId, userId);
                
                // Send confirmation back to user
                messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notification-updates",
                    Map.of(
                        "action", "MARKED_READ",
                        "notificationId", notificationId,
                        "success", true
                    )
                );
            } else {
                // Send error back to user
                messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notification-updates",
                    Map.of(
                        "action", "MARKED_READ",
                        "notificationId", notificationId,
                        "success", false,
                        "error", "Failed to mark notification as read"
                    )
                );
            }
        }
    }

    /**
     * Handle notification dismissal via WebSocket
     */
    @MessageMapping("/notifications/dismiss")
    public void dismissNotification(@Payload Map<String, String> payload, Principal principal) {
        String userId = principal.getName();
        String notificationId = payload.get("notificationId");
        
        if (notificationId != null) {
            boolean success = notificationService.markAsDismissed(notificationId, userId);
            
            if (success) {
                log.info("Dismissed notification {} for user {} via WebSocket", notificationId, userId);
                
                // Send confirmation back to user
                messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notification-updates",
                    Map.of(
                        "action", "DISMISSED",
                        "notificationId", notificationId,
                        "success", true
                    )
                );
            } else {
                // Send error back to user
                messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notification-updates",
                    Map.of(
                        "action", "DISMISSED",
                        "notificationId", notificationId,
                        "success", false,
                        "error", "Failed to dismiss notification"
                    )
                );
            }
        }
    }

    /**
     * Handle mark all as read via WebSocket
     */
    @MessageMapping("/notifications/mark-all-read")
    public void markAllNotificationsAsRead(Principal principal) {
        String userId = principal.getName();
        
        try {
            notificationService.markAllAsRead(userId);
            log.info("Marked all notifications as read for user {} via WebSocket", userId);
            
            // Send confirmation back to user
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notification-updates",
                Map.of(
                    "action", "ALL_MARKED_READ",
                    "success", true
                )
            );
        } catch (Exception e) {
            log.error("Failed to mark all notifications as read for user {}: {}", userId, e.getMessage());
            
            // Send error back to user
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notification-updates",
                Map.of(
                    "action", "ALL_MARKED_READ",
                    "success", false,
                    "error", "Failed to mark all notifications as read"
                )
            );
        }
    }

    /**
     * Handle client ping for connection health check
     */
    @MessageMapping("/notifications/ping")
    @SendToUser("/queue/notification-updates")
    public Map<String, Object> handlePing(Principal principal) {
        String userId = principal.getName();
        log.debug("Received ping from user {}", userId);
        
        return Map.of(
            "action", "PONG",
            "timestamp", System.currentTimeMillis(),
            "unreadCount", notificationService.getUnreadNotificationCount(userId)
        );
    }

    /**
     * Send notification to specific user (called by service layer)
     */
    public void sendNotificationToUser(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                notification
            );
            log.debug("Sent notification to user {} via WebSocket", userId);
        } catch (Exception e) {
            log.error("Failed to send notification to user {} via WebSocket: {}", userId, e.getMessage());
        }
    }

    /**
     * Broadcast notification update to specific user
     */
    public void sendNotificationUpdate(String userId, Map<String, Object> update) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notification-updates",
                update
            );
            log.debug("Sent notification update to user {} via WebSocket", userId);
        } catch (Exception e) {
            log.error("Failed to send notification update to user {} via WebSocket: {}", userId, e.getMessage());
        }
    }
}