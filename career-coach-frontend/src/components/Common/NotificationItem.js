import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Collapse,
  Link,
  CircularProgress
} from '@mui/material';
import {
  MarkEmailRead,
  Delete,
  ExpandMore,
  ExpandLess,
  OpenInNew,
  Schedule,
  Priority,
  Work,
  Message,
  Assessment,
  School,
  Person,
  Security,
  Notifications,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

const NotificationItem = ({ notification, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState({ read: false, delete: false });
  const { markAsRead, deleteNotification } = useNotifications();

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (notification.status === 'READ') return;
    
    setLoading(prev => ({ ...prev, read: true }));
    try {
      await markAsRead(notification.id);
    } finally {
      setLoading(prev => ({ ...prev, read: false }));
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await deleteNotification(notification.id);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
      if (onClose) onClose();
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const iconMap = {
      CV_REVIEW_COMPLETED: Assessment,
      CV_REVIEW_REQUESTED: Assessment,
      NEW_MESSAGE: Message,
      APPLICATION_STATUS_UPDATE: Work,
      INTERVIEW_SCHEDULED: Schedule,
      INTERVIEW_REMINDER: Schedule,
      PROFILE_UPDATE_REMINDER: Person,
      SKILL_ASSESSMENT_AVAILABLE: School,
      SYSTEM_MAINTENANCE: Security,
      ACCOUNT_SECURITY: Security,
      GENERAL: Notifications
    };
    
    const IconComponent = iconMap[type] || Notifications;
    return <IconComponent fontSize="small" />;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'UNREAD': return 'primary';
      case 'READ': return 'default';
      case 'DISMISSED': return 'secondary';
      case 'ARCHIVED': return 'disabled';
      default: return 'default';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Check if notification is expired
  const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: notification.status === 'UNREAD' ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
        opacity: isExpired ? 0.6 : 1,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
        cursor: 'pointer',
      }}
      onClick={toggleExpanded}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Notification Icon */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: `${getPriorityColor(notification.priority)}.light`,
            color: `${getPriorityColor(notification.priority)}.main`,
          }}
        >
          {getNotificationIcon(notification.type)}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: notification.status === 'UNREAD' ? 600 : 400,
                color: isExpired ? 'text.disabled' : 'text.primary',
              }}
            >
              {notification.title}
            </Typography>
            
            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              {notification.status === 'UNREAD' && (
                <Tooltip title="Mark as read">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleMarkAsRead}
                      disabled={loading.read}
                      sx={{ color: 'primary.main' }}
                    >
                      {loading.read ? (
                        <CircularProgress size={16} />
                      ) : (
                        <MarkEmailRead fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              
              <Tooltip title="Delete">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    disabled={loading.delete}
                    sx={{ color: 'error.main' }}
                  >
                    {loading.delete ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Delete fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              
              <IconButton size="small" onClick={toggleExpanded}>
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          {/* Message Preview */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'none' : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {notification.message}
          </Typography>

          {/* Metadata */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={notification.status}
              size="small"
              color={getStatusColor(notification.status)}
              variant="outlined"
            />
            
            <Chip
              label={notification.priority}
              size="small"
              color={getPriorityColor(notification.priority)}
              variant="filled"
              sx={{ fontSize: '0.7rem' }}
            />
            
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(notification.createdAt)}
            </Typography>
            
            {isExpired && (
              <Chip
                label="Expired"
                size="small"
                color="error"
                variant="outlined"
                icon={<Warning fontSize="small" />}
              />
            )}
          </Box>

          {/* Expanded Content */}
          <Collapse in={expanded}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              {/* Full message */}
              <Typography variant="body2" sx={{ mb: 2 }}>
                {notification.message}
              </Typography>

              {/* Metadata */}
              {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Details:
                  </Typography>
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <Typography key={key} variant="caption" display="block" color="text.secondary">
                      {key}: {value}
                    </Typography>
                  ))}
                </Box>
              )}

              {/* Action Button */}
              {notification.actionUrl && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleActionClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    View Details
                    <OpenInNew fontSize="small" />
                  </Link>
                </Box>
              )}

              {/* Timestamps */}
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created: {new Date(notification.createdAt).toLocaleString()}
                </Typography>
                {notification.updatedAt && notification.updatedAt !== notification.createdAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Updated: {new Date(notification.updatedAt).toLocaleString()}
                  </Typography>
                )}
                {notification.expiresAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Expires: {new Date(notification.expiresAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationItem;