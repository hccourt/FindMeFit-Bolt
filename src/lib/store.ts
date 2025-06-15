import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { Class, Booking, User, Location, RegionSettings, UserRole, CreateClassRpcPayload, Notification, NotificationType, Toast } from './types';
import { searchLocations as searchLocationsApi } from './geocoding';

interface Venue {
  id: string;
  name: string;
  postal_code: string;
  city: string;
  coordinates: [number, number];
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

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

interface LocationState {
  currentLocation: Location | null;
  regionSettings: RegionSettings;
  isLoading: boolean;
  searchLocations: (query: string) => Promise<Location[]>;
  setCurrentLocation: (location: Location) => void;
  setRegionSettings: (settings: RegionSettings) => void;
  getCurrentLocation: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,

        signIn: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            if (data.user) {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (profileError) throw profileError;

              set({ user: profile, isLoading: false });
            }
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        signUp: async (email: string, password: string, name: string, role: UserRole) => {
          set({ isLoading: true });
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
            });

            if (error) throw error;

            if (data.user) {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  email,
                  name,
                  role,
                })
                .select()
                .single();

              if (profileError) throw profileError;

              set({ user: profile, isLoading: false });
            }
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        signOut: async () => {
          set({ isLoading: true });
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null, isLoading: false });
            useClassStore.getState().clearBookings();
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        updateProfile: async (updates: Partial<User>) => {
          const { user } = get();
          if (!user) throw new Error('No user logged in');

          set({ isLoading: true });
          try {
            const { data, error } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', user.id)
              .select()
              .single();

            if (error) throw error;

            set({ user: data, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        checkAuth: async () => {
          set({ isLoading: true });
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              if (error) throw error;
              set({ user: profile, isLoading: false });
            } else {
              set({ user: null, isLoading: false });
            }
          } catch (error) {
            set({ user: null, isLoading: false });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    )
  )
);

export const useClassStore = create<ClassState>()(
  devtools((set, get) => ({
    classes: [],
    bookings: [],
    isLoading: false,

    createClass: async (classData: CreateClassRpcPayload) => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase.rpc('create_class_with_venue', classData);
        
        if (error) throw error;
        
        await get().fetchClasses();
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    fetchClasses: async () => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            instructor:profiles!classes_instructor_id_fkey(*)
          `)
          .order('start_time', { ascending: true });

        if (error) throw error;

        set({ classes: data || [], isLoading: false });
      } catch (error) {
        console.error('Error fetching classes:', error);
        set({ isLoading: false });
      }
    },

    forceRefreshClasses: async () => {
      await get().fetchClasses();
    },

    searchVenues: async (query: string) => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(10);

        if (error) throw error;

        return data?.map(venue => ({
          ...venue,
          coordinates: venue.coordinates ? [venue.coordinates.x, venue.coordinates.y] as [number, number] : [0, 0] as [number, number]
        })) || [];
      } catch (error) {
        console.error('Error searching venues:', error);
        return [];
      }
    },

    findVenueByDetails: async (name: string, postalCode: string, city: string) => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .eq('name', name)
          .eq('postal_code', postalCode)
          .eq('city', city)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          return {
            ...data,
            coordinates: data.coordinates ? [data.coordinates.x, data.coordinates.y] as [number, number] : [0, 0] as [number, number]
          };
        }

        return null;
      } catch (error) {
        console.error('Error finding venue:', error);
        return null;
      }
    },

    createVenue: async (venueData: Omit<Venue, 'id' | 'verified' | 'verified_at' | 'verified_by'>) => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .insert({
            name: venueData.name,
            postal_code: venueData.postal_code,
            city: venueData.city,
            coordinates: `(${venueData.coordinates[0]},${venueData.coordinates[1]})`
          })
          .select()
          .single();

        if (error) throw error;

        return {
          ...data,
          coordinates: data.coordinates ? [data.coordinates.x, data.coordinates.y] as [number, number] : [0, 0] as [number, number]
        };
      } catch (error) {
        console.error('Error creating venue:', error);
        throw error;
      }
    },

    fetchBookings: async (userId: string) => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            class:classes(
              *,
              instructor:profiles!classes_instructor_id_fkey(*)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ bookings: data || [], isLoading: false });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        set({ isLoading: false });
      }
    },

    bookClass: async (classId: string, userId: string) => {
      set({ isLoading: true });
      try {
        const { error } = await supabase
          .from('bookings')
          .insert({
            class_id: classId,
            user_id: userId,
            status: 'confirmed',
          });

        if (error) throw error;

        await get().fetchBookings(userId);
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    cancelBooking: async (bookingId: string) => {
      set({ isLoading: true });
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);

        if (error) throw error;

        const { user } = useAuthStore.getState();
        if (user) {
          await get().fetchBookings(user.id);
        }
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    clearBookings: () => {
      set({ bookings: [] });
    },
  }))
);

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        currentLocation: null,
        regionSettings: {
          country: 'US',
          currency: 'USD',
          language: 'en',
          timezone: 'America/New_York',
        },
        isLoading: false,

        searchLocations: async (query: string) => {
          try {
            return await searchLocationsApi(query);
          } catch (error) {
            console.error('Error searching locations:', error);
            return [];
          }
        },

        setCurrentLocation: (location: Location) => {
          set({ currentLocation: location });
        },

        setRegionSettings: (settings: RegionSettings) => {
          set({ regionSettings: settings });
        },

        getCurrentLocation: async () => {
          set({ isLoading: true });
          try {
            if ('geolocation' in navigator) {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
              });

              const location: Location = {
                name: 'Current Location',
                coordinates: [position.coords.longitude, position.coords.latitude],
                city: '',
                country: '',
                postalCode: '',
              };

              set({ currentLocation: location, isLoading: false });
            } else {
              throw new Error('Geolocation not supported');
            }
          } catch (error) {
            console.error('Error getting current location:', error);
            set({ isLoading: false });
          }
        },
      }),
      {
        name: 'location-storage',
        partialize: (state) => ({
          currentLocation: state.currentLocation,
          regionSettings: state.regionSettings,
        }),
      }
    )
  )
);

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

export { useAuthStore }