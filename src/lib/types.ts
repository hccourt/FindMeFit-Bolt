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
  location: {
    name: string;
    city: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
  };
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