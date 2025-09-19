package com.careercoach.models;

public enum NotificationStatus {
    UNREAD("Unread", "Notification has not been read yet"),
    READ("Read", "Notification has been read"),
    DISMISSED("Dismissed", "Notification has been dismissed by user"),
    ARCHIVED("Archived", "Notification has been archived");

    private final String status;
    private final String description;

    NotificationStatus(String status, String description) {
        this.status = status;
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }
}