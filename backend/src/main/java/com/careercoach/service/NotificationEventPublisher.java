package com.careercoach.service;

import com.careercoach.models.Notification;
import com.careercoach.models.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEventPublisher {

    private final NotificationService notificationService;

    /**
     * Publish CV review completion notification
     */
    public void publishCvReviewCompleted(String userId, String cvId, String reviewerName, String feedback) {
        try {
            System.out.println("DEBUG: NotificationEventPublisher.publishCvReviewCompleted called");
            System.out.println("DEBUG: userId=" + userId + ", cvId=" + cvId + ", reviewerName=" + reviewerName);
            
            String title = "CV Review Complete";
            String message = String.format("Your CV review has been completed by %s. Check your feedback now!", 
                reviewerName != null ? reviewerName : "our team");
            
            Map<String, Object> metadata = Map.of(
                "cvId", cvId,
                "reviewerName", reviewerName != null ? reviewerName : "System",
                "feedbackPreview", feedback != null && feedback.length() > 100 ? 
                    feedback.substring(0, 100) + "..." : feedback != null ? feedback : "No feedback provided"
            );

            System.out.println("DEBUG: About to call notificationService.createNotification");
            Notification notification = notificationService.createNotification(
                userId,
                NotificationType.CV_REVIEW_COMPLETE,
                title,
                message,
                "HIGH",
                cvId, // relatedEntityId
                "/dashboard/cv-reviews/" + cvId, // actionUrl
                null, // expiresAt - No expiry
                metadata
            );
            System.out.println("DEBUG: Notification created successfully with ID: " + (notification != null ? notification.getId() : "null"));

            log.info("Published CV review completion notification for user {} and CV {}", userId, cvId);
        } catch (Exception e) {
            System.out.println("ERROR: Failed to publish CV review completion notification: " + e.getMessage());
            e.printStackTrace();
            log.error("Failed to publish CV review completion notification: {}", e.getMessage());
        }
    }

    /**
     * Publish new message notification
     */
    public void publishNewMessage(String userId, String senderId, String senderName, String messagePreview, String conversationId) {
        try {
            String title = "New Message";
            String message = String.format("You have a new message from %s", 
                senderName != null ? senderName : "Unknown User");
            
            Map<String, Object> metadata = Map.of(
                "senderId", senderId,
                "senderName", senderName != null ? senderName : "Unknown User",
                "messagePreview", messagePreview != null && messagePreview.length() > 50 ? 
                    messagePreview.substring(0, 50) + "..." : messagePreview != null ? messagePreview : "New message",
                "conversationId", conversationId != null ? conversationId : ""
            );

            notificationService.createNotification(
                userId,
                NotificationType.NEW_MESSAGE,
                title,
                message,
                "MEDIUM",
                conversationId,
                "/messages/" + conversationId,
                LocalDateTime.now().plusDays(7), // Expire in 7 days
                metadata
            );

            log.info("Published new message notification for user {} from sender {}", userId, senderId);
        } catch (Exception e) {
            log.error("Failed to publish new message notification: {}", e.getMessage());
        }
    }

    /**
     * Publish application status update notification
     */
    public void publishApplicationStatusUpdate(String userId, String jobTitle, String companyName, String newStatus, String applicationId) {
        try {
            String title = "Application Status Updated";
            String message = String.format("Your application for %s at %s has been %s", 
                jobTitle != null ? jobTitle : "a position",
                companyName != null ? companyName : "the company",
                newStatus != null ? newStatus.toLowerCase() : "updated");
            
            Map<String, Object> metadata = Map.of(
                "jobTitle", jobTitle != null ? jobTitle : "Unknown Position",
                "companyName", companyName != null ? companyName : "Unknown Company",
                "newStatus", newStatus != null ? newStatus : "Unknown",
                "applicationId", applicationId != null ? applicationId : ""
            );

            String priority = "HIGH";
            if (newStatus != null) {
                if (newStatus.toLowerCase().contains("accept") || newStatus.toLowerCase().contains("offer")) {
                    priority = "HIGH";
                } else if (newStatus.toLowerCase().contains("reject") || newStatus.toLowerCase().contains("decline")) {
                    priority = "HIGH";
                } else {
                    priority = "MEDIUM";
                }
            }

            notificationService.createNotification(
                userId,
                NotificationType.APPLICATION_STATUS_UPDATE,
                title,
                message,
                priority,
                applicationId,
                "/dashboard/applications/" + applicationId,
                null, // No expiry
                metadata
            );

            log.info("Published application status update notification for user {} and application {}", userId, applicationId);
        } catch (Exception e) {
            log.error("Failed to publish application status update notification: {}", e.getMessage());
        }
    }

    /**
     * Publish profile update reminder notification
     */
    public void publishProfileUpdateReminder(String userId) {
        try {
            String title = "Complete Your Profile";
            String message = "Your profile is incomplete. Complete it now to increase your chances of getting hired!";
            
            Map<String, Object> metadata = Map.of(
                "reminderType", "PROFILE_COMPLETION",
                "priority", "MEDIUM"
            );

            notificationService.createNotification(
                userId,
                NotificationType.PROFILE_UPDATE_REMINDER,
                title,
                message,
                "MEDIUM",
                userId,
                "/profile/edit",
                LocalDateTime.now().plusDays(3), // Expire in 3 days
                metadata
            );

            log.info("Published profile update reminder notification for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to publish profile update reminder notification: {}", e.getMessage());
        }
    }

    /**
     * Publish job recommendation notification
     */
    public void publishJobRecommendation(String userId, String jobTitle, String companyName, String jobId, int matchPercentage) {
        try {
            String title = "New Job Recommendation";
            String message = String.format("We found a %d%% match for you: %s at %s", 
                matchPercentage,
                jobTitle != null ? jobTitle : "a great position",
                companyName != null ? companyName : "an amazing company");
            
            Map<String, Object> metadata = Map.of(
                "jobTitle", jobTitle != null ? jobTitle : "Unknown Position",
                "companyName", companyName != null ? companyName : "Unknown Company",
                "jobId", jobId != null ? jobId : "",
                "matchPercentage", matchPercentage
            );

            String priority = matchPercentage >= 80 ? "HIGH" : "MEDIUM";

            notificationService.createNotification(
                userId,
                NotificationType.JOB_RECOMMENDATION,
                title,
                message,
                priority,
                jobId,
                "/jobs/" + jobId,
                LocalDateTime.now().plusDays(14), // Expire in 14 days
                metadata
            );

            log.info("Published job recommendation notification for user {} with {}% match", userId, matchPercentage);
        } catch (Exception e) {
            log.error("Failed to publish job recommendation notification: {}", e.getMessage());
        }
    }

    /**
     * Publish interview scheduled notification
     */
    public void publishInterviewScheduled(String userId, String jobTitle, String companyName, LocalDateTime interviewDateTime, String interviewId) {
        try {
            String title = "Interview Scheduled";
            String message = String.format("Your interview for %s at %s has been scheduled for %s", 
                jobTitle != null ? jobTitle : "a position",
                companyName != null ? companyName : "the company",
                interviewDateTime != null ? interviewDateTime.toString() : "soon");
            
            Map<String, Object> metadata = Map.of(
                "jobTitle", jobTitle != null ? jobTitle : "Unknown Position",
                "companyName", companyName != null ? companyName : "Unknown Company",
                "interviewDateTime", interviewDateTime != null ? interviewDateTime.toString() : "",
                "interviewId", interviewId != null ? interviewId : ""
            );

            notificationService.createNotification(
                userId,
                NotificationType.INTERVIEW_SCHEDULED,
                title,
                message,
                "HIGH",
                interviewId,
                "/dashboard/interviews/" + interviewId,
                null, // No expiry
                metadata
            );

            log.info("Published interview scheduled notification for user {} and interview {}", userId, interviewId);
        } catch (Exception e) {
            log.error("Failed to publish interview scheduled notification: {}", e.getMessage());
        }
    }

    /**
     * Publish skill assessment completion notification
     */
    public void publishSkillAssessmentComplete(String userId, String skillName, int score, String assessmentId) {
        try {
            String title = "Skill Assessment Complete";
            String message = String.format("You scored %d%% on your %s assessment. Great job!", 
                score, skillName != null ? skillName : "skill");
            
            Map<String, Object> metadata = Map.of(
                "skillName", skillName != null ? skillName : "Unknown Skill",
                "score", score,
                "assessmentId", assessmentId != null ? assessmentId : ""
            );

            String priority = score >= 80 ? "HIGH" : "MEDIUM";

            notificationService.createNotification(
                userId,
                NotificationType.SKILL_ASSESSMENT_COMPLETE,
                title,
                message,
                priority,
                assessmentId,
                "/dashboard/assessments/" + assessmentId,
                null, // No expiry
                metadata
            );

            log.info("Published skill assessment completion notification for user {} with score {}", userId, score);
        } catch (Exception e) {
            log.error("Failed to publish skill assessment completion notification: {}", e.getMessage());
        }
    }

    /**
     * Publish system maintenance notification
     */
    public void publishSystemMaintenance(String userId, String maintenanceTitle, String maintenanceMessage, LocalDateTime scheduledTime) {
        try {
            String title = maintenanceTitle != null ? maintenanceTitle : "System Maintenance";
            String message = maintenanceMessage != null ? maintenanceMessage : 
                "Scheduled system maintenance will occur soon. Please save your work.";
            
            Map<String, Object> metadata = Map.of(
                "maintenanceType", "SYSTEM_MAINTENANCE",
                "scheduledTime", scheduledTime != null ? scheduledTime.toString() : ""
            );

            notificationService.createNotification(
                userId,
                NotificationType.SYSTEM_MAINTENANCE,
                title,
                message,
                "MEDIUM",
                null,
                "/dashboard",
                scheduledTime != null ? scheduledTime.plusHours(2) : LocalDateTime.now().plusHours(2),
                metadata
            );

            log.info("Published system maintenance notification for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to publish system maintenance notification: {}", e.getMessage());
        }
    }

    /**
     * Publish account security alert notification
     */
    public void publishSecurityAlert(String userId, String alertType, String alertMessage) {
        try {
            String title = "Security Alert";
            String message = alertMessage != null ? alertMessage : 
                "We detected unusual activity on your account. Please review your security settings.";
            
            Map<String, Object> metadata = Map.of(
                "alertType", alertType != null ? alertType : "GENERAL_SECURITY",
                "timestamp", LocalDateTime.now().toString()
            );

            notificationService.createNotification(
                userId,
                NotificationType.SECURITY_ALERT,
                title,
                message,
                "HIGH",
                null,
                "/profile/security",
                null, // No expiry
                metadata
            );

            log.info("Published security alert notification for user {} with type {}", userId, alertType);
        } catch (Exception e) {
            log.error("Failed to publish security alert notification: {}", e.getMessage());
        }
    }

    /**
     * Publish general system notification
     */
    public void publishSystemNotification(String userId, String title, String message, String priority, String actionUrl) {
        try {
            Map<String, Object> metadata = Map.of(
                "notificationType", "SYSTEM_NOTIFICATION",
                "timestamp", LocalDateTime.now().toString()
            );

            notificationService.createNotification(
                userId,
                NotificationType.SYSTEM_NOTIFICATION,
                title != null ? title : "System Notification",
                message != null ? message : "You have a new system notification.",
                priority != null ? priority : "MEDIUM",
                null,
                actionUrl != null ? actionUrl : "/dashboard",
                LocalDateTime.now().plusDays(30), // Expire in 30 days
                metadata
            );

            log.info("Published system notification for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to publish system notification: {}", e.getMessage());
        }
    }
}