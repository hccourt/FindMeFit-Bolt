import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { Class, Booking, User, Location, RegionSettings, UserRole, CreateClassRpcPayload } from './types';
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

export const useClassStore = create<ClassState>()(
  devtools((set, get) => ({
    classes: [],
    bookings: [],
    isLoading: false,
    
    searchVenues: async (query: string) => {
      if (!query || query.length < 2) return [];
      
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(10);
        
        if (error) throw error;
        
        return data.map(venue => {
          const coordsMatch = venue.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
          return {
            ...venue,
            coordinates: coordsMatch ? {
              latitude: parseFloat(coordsMatch[1]),
              longitude: parseFloat(coordsMatch[2])
            } : null
          };
        });
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
          .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        const coordsMatch = data.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
        return {
          ...data,
          coordinates: coordsMatch ? {
            latitude: parseFloat(coordsMatch[1]),
            longitude: parseFloat(coordsMatch[2])
          } : null
        };
      } catch (error) {
        console.error('Error finding venue:', error);
        return null;
      }
    },
    
    createVenue: async (venueData) => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .insert([{
            ...venueData,
            coordinates: `(${venueData.coordinates.latitude},${venueData.coordinates.longitude})`
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        const coordsMatch = data.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
        if (!coordsMatch) {
          throw new Error('Invalid coordinates format received from database');
        }
        
        return {
          ...data,
          coordinates: {
            latitude: parseFloat(coordsMatch[1]),
            longitude: parseFloat(coordsMatch[2])
          }
        };
      } catch (error) {
        console.error('Error creating venue:', error);
        throw error;
      }
    },
    
    createClass: async (classData: CreateClassRpcPayload) => {
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
        console.log('🔍 Starting fetchClasses...');
        const { currentRegion } = useRegionStore.getState();
        if (!currentRegion || !currentRegion.bounds) {
          throw new Error('Region not properly configured');
        }

        // Get all classes
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
          `)
          .order('created_at', { ascending: false });
        
        if (classesError) throw classesError;
        console.log('📚 Classes fetched:', classesData?.length || 0);
        
        // Get participant counts using the secure function
        const { data: participantCounts, error: participantCountsError } = await supabase
          .rpc('get_all_class_participant_counts');
        
        if (participantCountsError) throw participantCountsError;
        console.log('👥 Participant counts from function:', participantCounts);
        
        // Create a map of class_id to participant count from the function result
        const participantCountsMap: Record<string, number> = {};
        (participantCounts || []).forEach(item => {
          participantCountsMap[item.class_id] = item.participant_count;
        });
        console.log('👥 Participant counts map:', participantCountsMap);
        
        // Filter classes by region bounds before processing
        const filteredClassesData = classesData.filter(item => {
          if (!item.coordinates) return false;
          const coordsMatch = item.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
          if (!coordsMatch) return false;
          
          const lat = parseFloat(coordsMatch[1]);
          const lon = parseFloat(coordsMatch[2]);
          
          return lat >= currentRegion.bounds.south &&
                 lat <= currentRegion.bounds.north &&
                 lon >= currentRegion.bounds.west &&
                 lon <= currentRegion.bounds.east;
        });
        console.log('🌍 Classes after region filtering:', filteredClassesData?.length || 0);

        // Get user-specific booking information
        const user = useAuthStore.getState().user;
        let userBookings: any[] = [];
        
        if (user) {
          console.log('👤 Current user:', user.id, user.email);
          const { data: userBookingsData, error: userBookingsError } = await supabase
            .from('bookings')
            .select('class_id, status')
            .eq('user_id', user.id)
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false });
          
          if (userBookingsError) {
            console.error('Error fetching user bookings:', userBookingsError);
          } else {
            userBookings = userBookingsData || [];
            console.log('📝 User bookings:', userBookings);
          }
        } else {
          console.log('👤 No user logged in');
        }
        
        const transformedData = filteredClassesData.map(item => {
          let coordinates = null;
          if (item.coordinates) {
            const coordsMatch = item.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
            if (coordsMatch) {
              coordinates = {
                latitude: parseFloat(coordsMatch[1]),
                longitude: parseFloat(coordsMatch[2])
              };
            }
          }

          // Check if current user has booked this class
          const userBooking = userBookings.find(b => b.class_id === item.id);
          const isBooked = !!userBooking;
          
          // Use the participant count from the secure function
          const actualParticipants = participantCountsMap[item.id] || 0;
          
          console.log(`🎯 Class "${item.title}" (${item.id}):`, {
            actualParticipants,
            maxParticipants: item.max_participants,
            isBooked,
            userBooking
          });

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
              specialties: [],
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
            currentParticipants: actualParticipants,
            type: item.type,
            level: item.level,
            tags: item.tags,
            imageUrl: item.image_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
            isBooked
          };
        });
        
        console.log('✅ Final transformed classes:', transformedData.map(c => ({
          id: c.id,
          title: c.title,
          currentParticipants: c.currentParticipants,
          maxParticipants: c.maxParticipants,
          isBooked: c.isBooked
        })));
        
        set({ classes: transformedData, isLoading: false });
      } catch (error) {
        console.error('Error fetching classes:', error);
        set({ isLoading: false });
      }
    },
    
    forceRefreshClasses: async () => {
      console.log('🔄 Force refreshing classes...');
      // Clear any cached data
      set({ classes: [], isLoading: true });
      
      // Add a small delay to ensure any pending operations complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch fresh data
      await get().fetchClasses();
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
        console.log('🎫 Starting bookClass for:', { classId, userId });
        
        // Get class data
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('max_participants')
          .eq('id', classId)
          .single();
        
        if (classError) throw classError;
        if (!classData) throw new Error('Class not found');
        console.log('📊 Class data:', classData);
        
        // Check for existing booking
        const { data: existingBooking, error: bookingCheckError } = await supabase
          .from('bookings')
          .select('id, status')
          .eq('class_id', classId)
          .eq('user_id', userId)
          .eq('status', 'confirmed')
          .maybeSingle();
        
        if (bookingCheckError) throw bookingCheckError;
        if (existingBooking) throw new Error('You already have a booking for this class');
        console.log('🔍 Existing booking check:', existingBooking);
        
        // Get real-time confirmed bookings count
        const { data: confirmedBookings, error: countError } = await supabase
          .from('bookings')
          .select('id')
          .eq('class_id', classId)
          .eq('status', 'confirmed');
        
        if (countError) throw countError;
        
        const currentParticipants = confirmedBookings?.length || 0;
        console.log('👥 Current participants before booking:', currentParticipants, 'Max:', classData.max_participants);
        
        if (currentParticipants >= classData.max_participants) {
          throw new Error('Class is full');
        }
        
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
          .select()
          .single();
        
        if (bookingError) throw bookingError;
        console.log('✅ New booking created:', newBooking);
        
        // Add to local bookings state
        set(state => ({
          bookings: [...state.bookings, newBooking as Booking],
          isLoading: false
        }));
        
        // Refresh classes to get updated participant counts
        console.log('🔄 Refreshing classes after booking...');
        await get().forceRefreshClasses();
        
        return newBooking;
      } catch (error) {
        console.error('Error booking class:', error);
        set({ isLoading: false });
        throw error;
      }
    },
    
    cancelBooking: async (bookingId: string) => {
      set({ isLoading: true });
      try {
        // Cancel the booking
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);
        
        if (error) throw error;
        
        // Update local state
        set(state => ({
          bookings: state.bookings.filter(b => b.id !== bookingId),
          isLoading: false
        }));
        
        // Refresh classes to get updated participant counts
        await get().forceRefreshClasses();
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
    bounds: {
      north: 49.384358,  // Northern tip of mainland US
      south: 24.396308,  // Southern tip of mainland US
      east: -66.934570,  // Eastern tip of mainland US
      west: -125.000000, // Western tip of mainland US
    }
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
    bounds: {
      north: 58.635500,  // Northern tip of Scotland
      south: 49.892485,  // Southern tip of England
      east: 1.759000,    // Eastern tip of England
      west: -8.649000,   // Western tip of Ireland
    }
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
    bounds: {
      north: 71.185474,  // Northern tip of Norway
      south: 35.000000,  // Southern tip of Greece
      east: 31.000000,   // Eastern tip of Finland
      west: -0.500000,   // Western boundary moved east to exclude GB
    }
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

      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('max_participants')
        .eq('id', classId)
        .single();
      
      if (classError) throw classError;
      
      // Get actual participant count from bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('class_id', classId)
        .eq('status', 'confirmed');
      
      if (bookingsError) throw bookingsError;
      
      const actualParticipants = bookings?.length || 0;
      
      if (!classData || actualParticipants >= classData.max_participants) {
        throw new Error('Class is full');
      }
      
      const { data: existingBooking, error: bookingCheckError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('class_id', classId)
        .eq('user_id', user.id)
        .not('status', 'eq', 'cancelled')
        .maybeSingle();
      
      if (bookingCheckError) throw bookingCheckError;
      if (existingBooking) throw new Error('You already have a booking for this class');
      
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
      
      set(state => ({
        bookings: [...state.bookings, data as Booking],
        isLoading: false
      }));
      
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