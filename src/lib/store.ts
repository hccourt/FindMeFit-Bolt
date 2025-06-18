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
  coordinates: {
    latitude: number;
    longitude: number;
  };
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
  bio?: string;
  location?: string;
  phone?: string;
  rating?: number;
  review_count?: number;
  experience?: number;
  specialties?: string[];
  joined?: string;
  created_at?: string;
  updated_at?: string;
}

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
  subscribeToNotifications: () => void;
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
            
            // Check if user already exists in profiles table
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('email')
              .eq('email', email)
              .maybeSingle();
            
            if (existingProfile) {
              throw new Error('An account with this email already exists');
            }
            
            const { data: { session, user }, error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                  role
                },
                emailRedirectTo: `${window.location.origin}/auth/confirm`,
              }
            });
            
            if (authError) throw authError;
            
            // Log the response for debugging
            console.log('Signup response:', { 
              user: user ? { id: user.id, email: user.email, confirmed: user.email_confirmed_at } : null, 
              session: session ? 'exists' : 'none' 
            });
            
            // Check if user was created but not confirmed
            if (user && !user.email_confirmed_at) {
              console.log('User created but email not confirmed - this is correct');
            } else if (user && user.email_confirmed_at) {
              console.log('User created and email already confirmed - this might indicate email confirmation is disabled');
            }
            
            // Don't log the user in immediately - they need to verify their email first
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            
            return { user, needsVerification: !user?.email_confirmed_at };
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
  requestUserLocation: () => Promise<void>;
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
        isRequestingLocation: false,
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
        requestUserLocation: async () => {
          set({ isRequestingLocation: true });
          
          try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
              console.log('Geolocation is not supported by this browser');
              return;
            }
            
            // Request user's current position
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000 // 5 minutes
                }
              );
            });
            
            const { latitude, longitude } = position.coords;
            console.log('User location:', { latitude, longitude });
            
            // Reverse geocode to get location name
            const response = await fetch(
              `/api/nominatim/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`
            );
            
            if (!response.ok) {
              throw new Error('Failed to reverse geocode location');
            }
            
            const data = await response.json();
            console.log('Reverse geocoding result:', data);
            
            // Extract location information
            const address = data.address || {};
            const city = address.city || address.town || address.village || address.hamlet || 'Unknown City';
            const country = address.country || 'Unknown Country';
            const state = address.state || address.region || '';
            
            const locationName = city;
            const parentName = state ? `${state}, ${country}` : country;
            
            // Create location object
            const userLocation: Location = {
              id: `user-location-${Date.now()}`,
              name: locationName,
              type: 'city',
              parent: {
                id: 'parent-location',
                name: parentName,
                type: 'country'
              },
              coordinates: {
                latitude,
                longitude
              }
            };
            
            // Set the location
            get().setLocation(userLocation);
            
            // Update region based on country
            const countryToRegion: Record<string, string> = {
              'United Kingdom': 'gb',
              'United States': 'us',
              'Germany': 'eu',
              'France': 'eu',
              'Italy': 'eu',
              'Spain': 'eu',
              'Netherlands': 'eu',
              'Belgium': 'eu',
              'Austria': 'eu',
              'Switzerland': 'ch',
              'Australia': 'au',
              'Canada': 'ca',
              'Japan': 'jp',
              'China': 'cn',
              'Singapore': 'sg',
              'India': 'in',
              'Brazil': 'br',
              'Russia': 'ru',
              'South Africa': 'za',
              'Mexico': 'mx',
              'United Arab Emirates': 'ae',
              'New Zealand': 'nz',
              'Thailand': 'th',
            };
            
            const regionId = countryToRegion[country];
            if (regionId) {
              const regionStore = useRegionStore.getState();
              regionStore.setRegion(regionId);
              
              // Refresh classes after region change
              setTimeout(() => {
                useClassStore.getState().fetchClasses();
              }, 0);
            }
            
            console.log('Location set successfully:', userLocation);
            
          } catch (error) {
            console.log('Error getting user location:', error);
            // Don't show error to user, just silently fail
          } finally {
            set({ isRequestingLocation: false });
          }
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

export const useNotificationStore = create<NotificationState>()(
  devtools((set, get) => ({
    notifications: [],
    unreadCount: 0,
    toasts: [],
    isLoading: false,
    
    fetchNotifications: async () => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      set({ isLoading: true });
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const notifications = data || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        set({ 
          notifications, 
          unreadCount, 
          isLoading: false 
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        set({ isLoading: false });
      }
    },
    
    markAsRead: async (notificationId: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId);
        
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
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);
        
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
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };
      
      set(state => ({
        toasts: [...state.toasts, newToast]
      }));
      
      // Auto-remove toast after duration
      if (toast.duration !== 0) {
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration || 5000);
      }
    },
    
    removeToast: (toastId: string) => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== toastId)
      }));
    },
    
    subscribeToNotifications: () => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      
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
            const newNotification = payload.new as Notification;
            set(state => ({
              notifications: [newNotification, ...state.notifications],
              unreadCount: state.unreadCount + 1
            }));
            
            // Show toast for new notification
            get().addToast({
              type: 'info',
              title: newNotification.title,
              message: newNotification.message,
              duration: 5000
            });
          }
        )
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }))
);
