import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RegionSettings } from './types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'en-GB'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string, locale: string = 'en-GB'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en-US',
  });
}

export function formatCurrency(amount: number, region?: RegionSettings): string {
  const defaultRegion = {
    currencyLocale: 'en-US',
    currency: 'USD'
  };
  
  const { currencyLocale, currency } = region || defaultRegion;
  
  return new Intl.NumberFormat(currencyLocale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDistance(meters: number, region: RegionSettings): string {
  if (region.useMetric) {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  } else {
    const miles = meters / 1609.34;
    if (miles < 0.1) {
      return `${Math.round(meters)}m`;
    }
    return `${miles.toFixed(1)} mi`;
  }
}

export function formatTemperature(celsius: number, region: RegionSettings): string {
  if (region.temperatureUnit === 'C') {
    return `${Math.round(celsius)}°C`;
  }
  return `${Math.round((celsius * 9/5) + 32)}°F`;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

export function isCoordinateInRegion(
  lat: number,
  lon: number,
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lon <= bounds.east &&
    lon >= bounds.west
  );
}
