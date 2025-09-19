import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Refresh,
  MarkEmailRead,
  FilterList,
  Sort,
  Delete,
  Archive,
  CheckCircle,
  Schedule,
  Warning,
  Info
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationList = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAllAsRead,
    clearError
  } = useNotifications();

  const [activeTab, setActiveTab] = useState(0);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Tab options
  const tabs = [
    { label: 'All', value: 'all' },
    { label: `Unread (${unreadCount})`, value: 'unread' },
    { label: 'Read', value: 'read' }
  ];

  // Filter and sort notifications
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...notifications];

    // Filter by tab
    if (activeTab === 1) { // Unread
      filtered = filtered.filter(n => n.status === 'UNREAD');
    } else if (activeTab === 2) { // Read
      filtered = filtered.filter(n => n.status === 'READ');
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(n => n.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [notifications, activeTab, filterType, filterStatus, sortBy, sortOrder]);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications(0, 20);
  }, [fetchNotifications]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setPage(0);
    fetchNotifications(0, 20);
  }, [fetchNotifications]);

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [markAllAsRead]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, 20);
  }, [page, fetchNotifications]);

  // Sort menu handlers
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    handleSortClose();
  };

  // Filter menu handlers
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (type, status) => {
    setFilterType(type);
    setFilterStatus(status);
    handleFilterClose();
  };

  // Get notification type options
  const notificationTypes = [
    'CV_REVIEW_COMPLETED',
    'CV_REVIEW_REQUESTED',
    'NEW_MESSAGE',
    'APPLICATION_STATUS_UPDATE',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_REMINDER',
    'PROFILE_UPDATE_REMINDER',
    'SKILL_ASSESSMENT_AVAILABLE',
    'SYSTEM_MAINTENANCE',
    'ACCOUNT_SECURITY',
    'GENERAL'
  ];

  return (
    <Box sx={{ width: '100%', maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, pb: 1 }}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleRefresh} disabled={isLoading}>
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort">
              <IconButton size="small" onClick={handleSortClick}>
                <Sort fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter">
              <IconButton size="small" onClick={handleFilterClick}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllAsRead}
              sx={{ fontSize: '0.75rem' }}
            >
              Mark All Read
            </Button>
          )}
        </Box>

        {/* Active filters */}
        {(filterType !== 'all' || filterStatus !== 'all') && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {filterType !== 'all' && (
              <Chip
                label={`Type: ${filterType}`}
                size="small"
                onDelete={() => setFilterType('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {filterStatus !== 'all' && (
              <Chip
                label={`Status: ${filterStatus}`}
                size="small"
                onDelete={() => setFilterStatus('all')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ m: 2 }}
          >
            {error}
          </Alert>
        )}

        {isLoading && notifications.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {activeTab === 1 ? 'No unread notifications' : 
               activeTab === 2 ? 'No read notifications' : 
               'No notifications found'}
            </Typography>
          </Box>
        ) : [
          ...filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          )),

          // Load more button
          ...(hasMore && filteredNotifications.length >= 20 ? [
            <Box key="load-more" sx={{ p: 2, textAlign: 'center' }}>
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={16} /> : null}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          ] : [])
        ]}
      </Box>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortSelect('createdAt', 'desc')}>
          <ListItemIcon><Schedule fontSize="small" /></ListItemIcon>
          <ListItemText>Newest First</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('createdAt', 'asc')}>
          <ListItemIcon><Schedule fontSize="small" /></ListItemIcon>
          <ListItemText>Oldest First</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('priority', 'desc')}>
          <ListItemIcon><Warning fontSize="small" /></ListItemIcon>
          <ListItemText>High Priority First</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('title', 'asc')}>
          <ListItemIcon><Sort fontSize="small" /></ListItemIcon>
          <ListItemText>Title A-Z</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterSelect('all', 'all')}>
          <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
          <ListItemText>All Notifications</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemText>By Status</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('all', 'UNREAD')}>
          <ListItemIcon><Info fontSize="small" /></ListItemIcon>
          <ListItemText>Unread Only</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('all', 'read')}>
          <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
          <ListItemText>Read Only</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemText>By Type</ListItemText>
        </MenuItem>
        {notificationTypes.slice(0, 5).map((type) => (
          <MenuItem key={type} onClick={() => handleFilterSelect(type, 'all')}>
            <ListItemText>{type.replace(/_/g, ' ')}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NotificationList;