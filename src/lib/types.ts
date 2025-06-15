export type UserRole = 'client' | 'instructor' | 'admin';

export interface Location {
  id: string;
  name: string;
  type: 'city' | 'region' | 'country';
  parent?: {
    id: string;
    name: string;
    type: 'region' | 'country';
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface RegionSettings {
  id: string;
  name: string;
  currency: string;
  currencyLocale: string;
  dateLocale: string;
  useMetric: boolean;
  distanceUnit: 'km' | 'mi';
  temperatureUnit: 'C' | 'F';
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface Venue {
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  location?: string;
  phone?: string;
  joined: string;
}

export interface Instructor extends User {
  specialties: string[];
  rating: number;
  reviewCount: number;
  experience: number;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  venue: Venue;
  startTime: string;
  endTime: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  type: 'group' | 'personal';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags: string[];
  imageUrl?: string;
  isBooked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClassRpcPayload {
  title: string;
  description: string;
  instructor_id: string;
  location_name: string;
  location_address: string;
  location_city: string;
  location_coordinates: string;
  start_time: string;
  end_time: string;
  price: number;
  max_participants: number;
  type: 'group' | 'personal';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags: string[];
  image_url?: string;
}

export interface Booking {
  id: string;
  classId: string;
  userId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookedAt: string;
  paid: boolean;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'class_cancelled'
  | 'class_updated'
  | 'new_message'
  | 'payment_received'
  | 'review_received'
  | 'class_reminder'
  | 'system_announcement';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}