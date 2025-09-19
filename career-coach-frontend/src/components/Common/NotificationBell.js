import React, { useState, useRef, useEffect } from 'react';
import { Badge, IconButton, Popover, Box, Typography, Divider } from '@mui/material';
import { Notifications as NotificationsIcon, NotificationsNone } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from './NotificationList';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { unreadCount, isConnected, error } = useNotifications();
  const bellRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  // Determine bell icon color based on connection status
  const getBellColor = () => {
    if (error) return 'error';
    if (!isConnected) return 'disabled';
    return unreadCount > 0 ? 'primary' : 'default';
  };

  // Get tooltip text based on status
  const getTooltipText = () => {
    if (error) return 'Notification service error';
    if (!isConnected) return 'Connecting to notifications...';
    return unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications';
  };

  return (
    <>
      <IconButton
        ref={bellRef}
        onClick={handleClick}
        color={getBellColor()}
        title={getTooltipText()}
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              height: '18px',
              minWidth: '18px',
            },
          }}
        >
          {unreadCount > 0 ? (
            <NotificationsIcon />
          ) : (
            <NotificationsNone />
          )}
        </Badge>
        
        {/* Connection status indicator */}
        {!isConnected && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: error ? 'error.main' : 'warning.main',
              border: '1px solid white',
            }}
          />
        )}
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Notifications
          </Typography>
          
          {/* Connection status */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? 'success.main' : 'error.main',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
          
          {error && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
        
        <Divider />
        
        <NotificationList onClose={handleClose} />
      </Popover>
    </>
  );
};

export default NotificationBell;