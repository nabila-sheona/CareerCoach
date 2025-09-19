package com.careercoach.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    @NotBlank(message = "User ID is required")
    @Indexed
    private String userId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @Builder.Default
    private NotificationStatus status = NotificationStatus.UNREAD;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    private LocalDateTime dismissedAt;

    // Priority level for notification display (HIGH, MEDIUM, LOW)
    @Builder.Default
    private String priority = "MEDIUM";

    // Optional metadata for additional context
    private Map<String, Object> metadata;

    // Reference to related entity (e.g., CV review ID, message ID)
    private String relatedEntityId;

    // Action URL for clickable notifications
    private String actionUrl;

    // Expiry date for temporary notifications
    private LocalDateTime expiresAt;

    // Mark notification as read
    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    // Mark notification as dismissed
    public void markAsDismissed() {
        this.status = NotificationStatus.DISMISSED;
        this.dismissedAt = LocalDateTime.now();
    }

    // Check if notification is expired
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    // Check if notification is unread
    public boolean isUnread() {
        return status == NotificationStatus.UNREAD;
    }
}