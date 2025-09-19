package com.careercoach.models;

public enum NotificationType {
    CV_REVIEW_COMPLETE("CV Review Complete", "Your CV review has been completed"),
    CV_REVIEW_STARTED("CV Review Started", "Your CV review has been started"),
    NEW_MESSAGE("New Message", "You have received a new message"),
    APPLICATION_STATUS_UPDATED("Application Status Updated", "Your application status has been updated"),
    PROFILE_UPDATE_REMINDER("Profile Update Reminder", "Please update your profile information"),
    NEW_FEEDBACK_RECEIVED("New Feedback Received", "You have received new feedback"),
    TASK_COMPLETED("Task Completed", "A task has been completed"),
    TASK_ASSIGNED("Task Assigned", "A new task has been assigned to you"),
    SUCCESS_STORY_APPROVED("Success Story Approved", "Your success story has been approved"),
    SUCCESS_STORY_REJECTED("Success Story Rejected", "Your success story needs revision"),
    SYSTEM_ANNOUNCEMENT("System Announcement", "Important system announcement"),
    SKILL_ASSESSMENT_COMPLETE("Skill Assessment Complete", "Your skill assessment has been completed"),
    SYSTEM_MAINTENANCE("System Maintenance", "System maintenance notification"),
    SECURITY_ALERT("Security Alert", "Security alert notification"),
    SYSTEM_NOTIFICATION("System Notification", "General system notification");

    private final String title;
    private final String defaultMessage;

    NotificationType(String title, String defaultMessage) {
        this.title = title;
        this.defaultMessage = defaultMessage;
    }

    public String getTitle() {
        return title;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}