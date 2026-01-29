import { create } from 'zustand';
import type {} from './types';

interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  
  // Computed
  getUnreadCount: () => number;
}

/**
 * Notification Store - Manages in-app notifications
 * Not persisted - notifications are fetched from server in production
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state with mock notifications
  notifications: [
    {
      id: 'notif-1',
      type: 'warning',
      title: 'Aprobación Pendiente',
      message: 'Tienes 1 factura pendiente de aprobación',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      read: false,
      actionUrl: '/payables',
      actionLabel: 'Ver Factura',
    },
    {
      id: 'notif-2',
      type: 'info',
      title: 'Nueva Cita Agendada',
      message: 'Cita con Dr. Carlos Méndez el 05 Nov a las 10:00 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: '/appointments',
      actionLabel: 'Ver Cita',
    },
    {
      id: 'notif-3',
      type: 'success',
      title: 'Afiliado Registrado',
      message: 'Juan Pérez ha sido registrado exitosamente',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ],
  
  // Get unread count (computed function)
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
  
  // Add notification
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
  
  // Mark as read
  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },
  
  // Mark all as read
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  },
  
  // Remove notification
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  // Clear all
  clearAll: () => {
    set({ notifications: [] });
  },
}));

/**
 * Selectors
 */
export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadCount = (state: NotificationState) => 
  state.notifications.filter((n) => !n.read).length;
export const selectUnreadNotifications = (state: NotificationState) =>
  state.notifications.filter((n) => !n.read);

/**
 * Helper hooks
 */
export const useNotifications = () => useNotificationStore(selectNotifications);
export const useUnreadCount = () => useNotificationStore(selectUnreadCount);
export const useUnreadNotifications = () =>
  useNotificationStore(selectUnreadNotifications);
