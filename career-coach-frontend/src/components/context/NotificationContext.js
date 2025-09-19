import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  isLoading: false,
  error: null,
  stompClient: null
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_STOMP_CLIENT: 'SET_STOMP_CLIENT',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const unreadCount = action.payload.filter(n => n.status === 'UNREAD').length;
      return { 
        ...state, 
        notifications: action.payload, 
        unreadCount,
        isLoading: false,
        error: null 
      };
    
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotifications = [action.payload, ...state.notifications];
      const newUnreadCount = action.payload.status === 'UNREAD' 
        ? state.unreadCount + 1 
        : state.unreadCount;
      return { 
        ...state, 
        notifications: newNotifications,
        unreadCount: newUnreadCount
      };
    
    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload.id ? action.payload : notification
      );
      const updatedUnreadCount = updatedNotifications.filter(n => n.status === 'UNREAD').length;
      return { 
        ...state, 
        notifications: updatedNotifications,
        unreadCount: updatedUnreadCount
      };
    
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      const filteredUnreadCount = filteredNotifications.filter(n => n.status === 'UNREAD').length;
      return { 
        ...state, 
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount
      };
    
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const readNotifications = state.notifications.map(notification =>
        notification.id === action.payload 
          ? { ...notification, status: 'READ' }
          : notification
      );
      const readUnreadCount = readNotifications.filter(n => n.status === 'UNREAD').length;
      return { 
        ...state, 
        notifications: readNotifications,
        unreadCount: readUnreadCount
      };
    
    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        status: 'READ'
      }));
      return { 
        ...state, 
        notifications: allReadNotifications,
        unreadCount: 0
      };
    
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };
    
    case NOTIFICATION_ACTIONS.SET_STOMP_CLIENT:
      return { ...state, stompClient: action.payload };
    
    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [], unreadCount: 0 };
    
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // WebSocket connection setup
  const connectWebSocket = useCallback((userId) => {
    if (state.stompClient && state.isConnected) {
      return; // Already connected
    }

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔌 Attempting WebSocket connection...');
    console.log('👤 User ID:', userId);
    console.log('🔑 Token exists:', !!token);
    console.log('👥 User data exists:', !!user);
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in.');
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required. Please log in.' });
      return;
    }

    try {
      // Create STOMP client with SockJS
      const stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        debug: (str) => {
          console.log('🔍 STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = (frame) => {
        console.log('✅ Connected to WebSocket:', frame);
        console.log('🎯 Subscribing to channels for user:', userId);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: true });
        dispatch({ type: NOTIFICATION_ACTIONS.SET_STOMP_CLIENT, payload: stompClient });

        // Subscribe to user-specific notifications
        const notificationSub = stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          console.log('📬 Received notification:', message.body);
          const notification = JSON.parse(message.body);
          dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
          
          // Show toast notification
          toast.info(notification.title, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
        console.log('📬 Subscribed to notifications:', `/user/${userId}/queue/notifications`);

        // Subscribe to notification updates
        const updateSub = stompClient.subscribe(`/user/${userId}/queue/notification-updates`, (message) => {
          console.log('🔄 Received notification update:', message.body);
          const updatedNotification = JSON.parse(message.body);
          dispatch({ type: NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION, payload: updatedNotification });
        });
        console.log('🔄 Subscribed to updates:', `/user/${userId}/queue/notification-updates`);

        // Subscribe to unread count updates (we need to add this to backend)
        const countSub = stompClient.subscribe(`/user/${userId}/queue/unread-count`, (message) => {
          console.log('🔢 Received unread count:', message.body);
          const count = parseInt(message.body);
          dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: count });
        });
        console.log('🔢 Subscribed to unread count:', `/user/${userId}/queue/unread-count`);
      };

      stompClient.onStompError = (frame) => {
        console.error('❌ STOMP Error:', frame);
        console.error('❌ Error headers:', frame.headers);
        console.error('❌ Error body:', frame.body);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: false });
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: frame.headers['message'] || 'Failed to connect to notification service' });
      };

      stompClient.onWebSocketError = (error) => {
        console.error('❌ WebSocket Error:', error);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: false });
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'WebSocket connection failed' });
        
        // Retry connection after 5 seconds
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(() => connectWebSocket(userId), 5000);
      };

      stompClient.onDisconnect = () => {
        console.log('🔌 Disconnected from WebSocket');
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: false });
        dispatch({ type: NOTIFICATION_ACTIONS.SET_STOMP_CLIENT, payload: null });
      };

      // Activate the client
      stompClient.activate();

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Failed to setup WebSocket connection' });
    }
  }, [state.stompClient, state.isConnected]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (state.stompClient && state.isConnected) {
      state.stompClient.deactivate();
    }
  }, [state.stompClient, state.isConnected]);

  // API functions
  const fetchNotifications = useCallback(async (page = 0, size = 10) => {
    // Check authentication first
    if (!isAuthenticated()) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required. Please login again.' });
      return;
    }

    dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const token = localStorage.getItem('token');
      
      // Double-check token validity before making the request
      if (!token || !isAuthenticated()) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        // Clear invalid token and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/notifications?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        // Clear invalid token and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: data.content || data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        // Clear invalid token and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      }
    } finally {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated()) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required' });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Double-check token validity before making the request
      if (!token || !isAuthenticated()) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated()) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required' });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Double-check token validity before making the request
      if (!token || !isAuthenticated()) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated()) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required' });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Double-check token validity before making the request
      if (!token || !isAuthenticated()) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
    } catch (error) {
      console.error('Error deleting notification:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const getUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication required' });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Double-check token validity before making the request
      if (!token || !isAuthenticated()) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/notifications/unread/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Authentication expired. Please login again.' });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: data.count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.email) {
      // Connect to WebSocket with user email (matches JWT subject)
      connectWebSocket(user.email);
      
      // Fetch initial notifications
      fetchNotifications();
      
      // Get initial unread count
      getUnreadCount();
    }

    // Cleanup on unmount or user change
    return () => {
      if (state.stompClient && state.isConnected) {
        disconnectWebSocket();
      }
    };
  }, [connectWebSocket, disconnectWebSocket, fetchNotifications, getUnreadCount, state.stompClient, state.isConnected]); // Add dependencies

  // Context value
  const contextValue = {
    ...state,
    connectWebSocket,
    disconnectWebSocket,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    clearError: () => dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: null }),
    clearNotifications: () => dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS })
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;