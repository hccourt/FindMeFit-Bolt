import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { Class, Booking, User, Location, RegionSettings, UserRole, CreateClassRpcPayload, Notification, NotificationType, Toast } from './types';
import { searchLocations as searchLocationsApi } from './geocoding';

interface ClassState {
  classes: Class[];
  bookings: Booking[];
  isLoading: boolean;
  createClass: (classData: CreateClassRpcPayload) => Promise<void>;
  fetchClasses: () => Promise<void>;
  forceRefreshClasses: () => Promise<void>;
  searchVenues: (query: string) => Promise<Venue[]>;
  findVenueByDetails: (name: string, postalCode: string, city: string) => Promise<Venue | null>;
  createVenue: (venueData: Omit<Venue, 'id' | 'verified' | 'verified_at' | 'verified_by'>) => Promise<Venue>;
  fetchBookings: (userId: string) => Promise<void>;
  bookClass: (classId: string, userId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  clearBookings: () => void;
}

[Previous content from original file remains exactly the same until the NotificationState interface]

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  toasts: Toast[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (toastId: string) => void;
  subscribeToNotifications: () => () => void;
  createNotification: (userId: string, type: NotificationType, title: string, message: string, data?: Record<string, any>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set, get) => ({
    notifications: [],
    unreadCount: 0,
    toasts: [],
    isLoading: false,
    
    fetchNotifications: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;
      
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        const notifications = data || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        set({ notifications, unreadCount, isLoading: false });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        set({ isLoading: false });
      }
    },
    
    markAsRead: async (notificationId: string) => {
      try {
        const { error } = await supabase.rpc('mark_notification_read', {
          notification_id: notificationId
        });
        
        if (error) throw error;
        
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    
    markAllAsRead: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;
      
      try {
        const { error } = await supabase.rpc('mark_all_notifications_read', {
          p_user_id: user.id
        });
        
        if (error) throw error;
        
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    },
    
    deleteNotification: async (notificationId: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId);
        
        if (error) throw error;
        
        set(state => {
          const notification = state.notifications.find(n => n.id === notificationId);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        });
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    },
    
    addToast: (toast: Omit<Toast, 'id'>) => {
      const id = Date.now().toString();
      const newToast = { ...toast, id };
      
      set(state => ({
        toasts: [...state.toasts, newToast]
      }));
      
      // Auto-remove toast after duration
      const duration = toast.duration || 5000;
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    },
    
    removeToast: (toastId: string) => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== toastId)
      }));
    },
    
    subscribeToNotifications: () => {
      const { user } = useAuthStore.getState();
      if (!user) return () => {};
      
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const notification = payload.new as Notification;
            
            set(state => ({
              notifications: [notification, ...state.notifications],
              unreadCount: state.unreadCount + 1
            }));
            
            // Show toast notification
            get().addToast({
              type: notification.type,
              title: notification.title,
              message: notification.message
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const notification = payload.new as Notification;
            
            set(state => ({
              notifications: state.notifications.map(n =>
                n.id === notification.id ? notification : n
              )
            }));
          }
        )
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    },
    
    createNotification: async (userId: string, type: NotificationType, title: string, message: string, data = {}) => {
      try {
        const { error } = await supabase.rpc('create_notification', {
          p_user_id: userId,
          p_type: type,
          p_title: title,
          p_message: message,
          p_data: data
        });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
  }))
);