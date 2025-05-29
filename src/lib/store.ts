import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { Class, Booking, User, Location, RegionSettings, UserRole } from './types';
import { searchLocations as searchLocationsApi } from './geocoding';

interface ClassState {
  classes: Class[];
  bookings: Booking[];
  isLoading: boolean;
  createClass: (classData: Omit<Class, 'id' | 'instructor' | 'currentParticipants'>) => Promise<void>;
  fetchClasses: () => Promise<void>;
  fetchBookings: (userId: string) => Promise<void>;
  bookClass: (classId: string, userId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  clearBookings: () => void;
}

export const useClassStore = create<ClassState>()(
  devtools((set, get) => ({
    classes: [],
    bookings: [],
    isLoading: false,
    
    createClass: async (classData) => {
      set({ isLoading: true });
      try {
        const { error } = await supabase
          .rpc('create_class', classData);
        
        if (error) throw error;
        
        await get().fetchClasses();
      } catch (error) {
        console.error('Error creating class:', error);
        set({ isLoading: false });
        throw error;
      }
    },
    
    fetchClasses: async () => {
      set({ isLoading: true });
      try {
        // First get all classes with instructor info
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select(`
            id,
            title,
            description,
            location:location_name,
            address:location_address,
            city:location_city,
            coordinates:location_coordinates,
            start_time,
            end_time,
            price,
            max_participants,
            current_participants,
            type,
            level,
            tags,
            image_url,
            created_at,
            updated_at,
            instructor:profiles (
              id,
              name,
              email,
              role,
              profile_image,
              bio,
              location,
              phone,
              rating,
              review_count,
              experience
            )
          `);
        
        if (classesError) throw classesError;
        
        // Get all bookings for the current user if authenticated
        const user = useAuthStore.getState().user;
        let bookingsData: any[] = [];
        
        if (user) {
          const { data: userBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id);
          
          if (bookingsError) throw bookingsError;
          bookingsData = userBookings || [];
        }
        
        const transformedData = classesData.map(item => {
          // Safely parse coordinates
          let coordinates = null;
          if (Array.isArray(item.coordinates) && 
              item.coordinates.length === 2 && 
              typeof item.coordinates[0] === 'number' && 
              typeof item.coordinates[1] === 'number' && 
              !isNaN(item.coordinates[0]) && 
              !isNaN(item.coordinates[1])) {
            coordinates = {
              latitude: item.coordinates[0],
              longitude: item.coordinates[1]
            };
          }

          // Check if user has booked this class
          const booking = bookingsData.find(b => b.class_id === item.id);
          const isBooked = booking && booking.status !== 'cancelled';

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            instructor: {
              id: item.instructor.id,
              name: item.instructor.name,
              email: item.instructor.email,
              role: item.instructor.role,
              profileImage: item.instructor.profile_image,
              bio: item.instructor.bio,
              location: item.instructor.location,
              phone: item.instructor.phone,
              specialties: [], // Set default empty array since column doesn't exist
              rating: item.instructor.rating || 0,
              reviewCount: item.instructor.review_count || 0,
              experience: item.instructor.experience || 0,
              joined: item.instructor.joined
            },
            location: {
              name: item.location,
              address: item.address,
              city: item.city,
              coordinates
            },
            startTime: item.start_time,
            endTime: item.end_time,
            price: item.price,
            maxParticipants: item.max_participants,
            currentParticipants: item.current_participants,
            type: item.type,
            level: item.level,
            tags: item.tags,
            imageUrl: item.image_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
            isBooked
          };
        });
        
        set({ classes: transformedData, isLoading: false });
      } catch (error) {
        console.error('Error fetching classes:', error);
        set({ isLoading: false });
      }
    },
    
    fetchBookings: async (userId: string) => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        set({ bookings: data as Booking[], isLoading: false });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        set({ isLoading: false });
      }
    },
    
    bookClass: async (classId: string, userId: string) => {
      set({ isLoading: true });
      try {
        // First check if there are spots available
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('max_participants, current_participants')
          .eq('id', classId)
          .single();
        
        if (classError) throw classError;
        
        if (!classData || classData.current_participants >= classData.max_participants) {
          throw new Error('Class is full');
        }
        
        // Check if user already has a booking
        const { data: existingBooking, error: bookingCheckError } = await supabase
          .from('bookings')
          .select('id, status')
          .eq('class_id', classId)
          .eq('user_id', userId)
          .not('status', 'eq', 'cancelled')
          .maybeSingle();
        
        if (bookingCheckError) throw bookingCheckError;
        if (existingBooking) throw new Error('You already have a booking for this class');
        
        // Create the booking
        const { data: newBooking, error: bookingError } = await supabase
          .from('bookings')
          .insert([
            {
              class_id: classId,
              user_id: userId,
              status: 'confirmed',
              booked_at: new Date().toISOString()
            }
          ])
          .single();
        
        if (bookingError) throw bookingError;
        
        // Update local state
        set(state => ({
          bookings: [...state.bookings, newBooking as Booking],
          isLoading: false
        }));
        
        // Update class participants count
        const { error: updateError } = await supabase
          .from('classes')
          .update({ current_participants: classData.current_participants + 1 })
          .eq('id', classId);
        
        if (updateError) throw updateError;
        
        // Update local classes state
        set(state => ({
          classes: state.classes.map(c => {
            if (c.id === classId) {
              return {
                ...c,
                currentParticipants: c.currentParticipants + 1
              };
            }
            return c;
          })
        }));
        
        return newBooking;
      } catch (error) {
        console.error('Error booking class:', error);
        set({ isLoading: false });
        throw error;
      } finally {
        set({ isLoading: false });
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
        
        set(state => ({
          bookings: state.bookings.filter(b => b.id !== bookingId),
          isLoading: false
        }));
      } catch (error) {
        console.error('Error cancelling booking:', error);
        set({ isLoading: false });
        throw error;
      }
    },
    
    clearBookings: () => {
      set({ bookings: [] });
    },
  }))
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async (email, password) => {
          try {
            set({ isLoading: true });
            const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (error) throw error;
            
            if (user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
              
              if (profile) {
                set({
                  user: profile,
                  isAuthenticated: true,
                  isLoading: false
                });
              }
            }
          } catch (error) {
            console.error('Error logging in:', error);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        register: async (name, email, password, role) => {
          try {
            set({ isLoading: true });
            const { data: { session, user }, error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                  role
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`
              }
            });
            
            if (authError) throw authError;
            
            if (user) {
              const { data: newProfile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  name,
                  email,
                  role,
                  joined: new Date().toISOString()
                })
                .select()
                .single();
              
              if (profileError) throw profileError;
              
              set({
                user: newProfile,
                isAuthenticated: true,
                isLoading: false
              });
            }
          } catch (error) {
            console.error('Error registering:', error);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        logout: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
          } catch (error) {
            console.error('Error signing out:', error);
          }
          
          set({
            user: null,
            isAuthenticated: false,
          });
        },
        checkAuth: async () => {
          try {
            set({ isLoading: true });
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (profile) {
                set({
                  user: profile,
                  isAuthenticated: true,
                  isLoading: false,
                });
                return;
              }
            }
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error checking auth:', error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } finally {
            set({ isLoading: false });
          }
        },
        updateProfile: async (updatedUser) => {
          try {
            set({ isLoading: true });
            const { error } = await supabase
              .from('profiles')
              .update(updatedUser)
              .eq('id', updatedUser.id);
            
            if (error) throw error;
            
            set(state => ({
              user: updatedUser,
              isLoading: false,
            }));
          } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface LocationState {
  currentLocation: Location | null;
  recentLocations: Location[];
  setLocation: (location: Location) => void;
  addRecentLocation: (location: Location) => void;
  searchLocations: (query: string) => Promise<Location[]>;
}

interface RegionState {
  currentRegion: RegionSettings;
  availableRegions: RegionSettings[];
  setRegion: (regionId: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    }
  ))
);

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        currentLocation: null,
        recentLocations: [],
        setLocation: (location) => {
          set({ currentLocation: location });
          get().addRecentLocation(location);
        },
        addRecentLocation: (location) => {
          set((state) => {
            const recentLocations = [
              location,
              ...state.recentLocations.filter((l) => l.id !== location.id),
            ].slice(0, 5);
            return { recentLocations };
          });
        },
        searchLocations: async (query) => {
          if (!query || query.length < 2) return [];
          return searchLocationsApi(query);
        },
      }),
      {
        name: 'location-storage',
      }
    )
  )
);

const regions: Record<string, RegionSettings> = {
  us: {
    id: 'us',
    name: 'United States',
    currency: 'USD',
    currencyLocale: 'en-US',
    dateLocale: 'en-US',
    useMetric: false,
    distanceUnit: 'mi',
    temperatureUnit: 'F',
  },
  gb: {
    id: 'gb',
    name: 'United Kingdom',
    currency: 'GBP',
    currencyLocale: 'en-GB',
    dateLocale: 'en-GB',
    useMetric: true,
    distanceUnit: 'km',
    temperatureUnit: 'C',
  },
  eu: {
    id: 'eu',
    name: 'European Union',
    currency: 'EUR',
    currencyLocale: 'de-DE',
    dateLocale: 'de-DE',
    useMetric: true,
    distanceUnit: 'km',
    temperatureUnit: 'C',
  },
};

export const useRegionStore = create<RegionState>()(
  devtools(
    persist(
      (set) => ({
        currentRegion: regions.us,
        availableRegions: Object.values(regions),
        setRegion: (regionId) => {
          const region = regions[regionId];
          if (region) {
            set({ currentRegion: region });
          }
        },
      }),
      {
        name: 'region-storage',
      }
    )
  )
);

interface StoreState {
  classes: Class[];
  bookings: Booking[];
  profile: Profile | null;
  isLoading: boolean;
  fetchClasses: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  bookClass: (classId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  clearBookings: () => void;
}

export const useStore = create<StoreState>((set) => ({
  classes: [],
  bookings: [],
  profile: null,
  isLoading: false,

  fetchClasses: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*');
      
      if (error) throw error;
      
      set({ classes: data as Class[], isLoading: false });
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
      
      if (error) throw error;
      
      set({ bookings: data as Booking[], isLoading: false });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      set({ profile: data as Profile, isLoading: false });
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  bookClass: async (classId: string) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // First check if there are spots available
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('max_participants, current_participants')
        .eq('id', classId)
        .single();
      
      if (classError) throw classError;
      
      if (!classData || classData.current_participants >= classData.max_participants) {
        throw new Error('Class is full');
      }
      
      // Check if user already has a booking
      const { data: existingBooking, error: bookingCheckError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('class_id', classId)
        .eq('user_id', userId)
        .not('status', 'eq', 'cancelled')
        .maybeSingle();
      
      if (bookingCheckError) throw bookingCheckError;
      if (existingBooking) throw new Error('You already have a booking for this class');
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            class_id: classId,
            user_id: user.id,
            status: 'confirmed',
            booked_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        bookings: [...state.bookings, data as Booking],
        isLoading: false
      }));
      
      // Update class participants count
      const { error: updateError } = await supabase
        .from('classes')
        .update({ current_participants: classData.current_participants + 1 })
        .eq('id', classId);
      
      if (updateError) throw updateError;
      
      // Update local classes state
      set(state => ({
        classes: state.classes.map(c => {
          if (c.id === classId) {
            return {
              ...c,
              currentParticipants: c.currentParticipants + 1
            };
          }
          return c;
        })
      }));
      
      return data;

      set(state => ({
        classes: state.classes.map(c => {
          if (c.id === classId) {
            return {
              ...c,
              currentParticipants: c.currentParticipants + 1,
            };
          }
          return c;
        })
      }));
    } catch (error) {
      console.error('Error booking class:', error);
      throw error;
    } finally {
      set({ isLoading: false });
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
      
      set(state => {
        const booking = state.bookings.find(b => b.id === bookingId);
        if (!booking) return state;
        
        const updatedClasses = state.classes.map(c => {
          if (c.id === booking.class_id) {
            return {
              ...c,
              currentParticipants: Math.max(0, c.currentParticipants - 1),
            };
          }
          return c;
        });
        
        return {
          classes: updatedClasses,
          bookings: state.bookings.filter(b => b.id !== bookingId),
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearBookings: () => {
    set({ bookings: [] });
  },
}));