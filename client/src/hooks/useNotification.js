import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import api from '../services/api';

export const useNotification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/notifications/unread/count');
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, status: 'read', readAt: new Date() } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read', readAt: new Date() }))
      );
      
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Archive notification
  const archiveNotification = useCallback(async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/archive`);
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, status: 'archived' } : n
        )
      );
      
      if (notifications.find(n => n._id === notificationId)?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.info('Notification archived');
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  }, [notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      if (deletedNotification?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Show toast notification
  const showToast = useCallback((type, message, options = {}) => {
    const toastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  }, []);

  // Show success notification
  const showSuccess = useCallback((message, options) => {
    showToast('success', message, options);
  }, [showToast]);

  // Show error notification
  const showError = useCallback((message, options) => {
    showToast('error', message, options);
  }, [showToast]);

  // Show info notification
  const showInfo = useCallback((message, options) => {
    showToast('info', message, options);
  }, [showToast]);

  // Show warning notification
  const showWarning = useCallback((message, options) => {
    showToast('warning', message, options);
  }, [showToast]);

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    if (!user) return;

    // Initialize WebSocket connection
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const ws = new WebSocket(`${wsUrl}?token=${localStorage.getItem('token')}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'notification') {
        // Add new notification
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast for new notification
        showInfo(data.notification.message, {
          autoClose: 7000,
          onClick: () => {
            // Handle click - maybe open notification center
          },
        });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user, showInfo]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Poll for unread count every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};