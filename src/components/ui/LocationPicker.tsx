import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Location } from '../../lib/types';
import { Map } from './Map';
import { useLocationStore, useRegionStore, useAuthStore, useClassStore } from '../../lib/store';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface LocationPickerProps {
  className?: string;
  modal?: boolean;
}

const getCountryFlag = (countryCode: string): string => {
  const offset = 127397;
  const first = countryCode.toUpperCase().charCodeAt(0);
  const second = countryCode.toUpperCase().charCodeAt(1);
  return String.fromCodePoint(first + offset, second + offset);
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ className, modal = false }) => {
  const { currentLocation, recentLocations, setLocation, searchLocations } = useLocationStore();
  const { currentRegion } = useRegionStore();
  const { user, updateProfile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSavePrompt(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        const results = await searchLocations(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [searchTerm, searchLocations]);
  
  const handleLocationSelect = (location: Location) => {
    setLocation(location);
    
    let country = '';
    if (location.parent?.name) {
      const parts = location.parent.name.split(', ');
      country = parts[parts.length - 1];
    }
    
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
    
    const regionId = country && countryToRegion[country];
    if (regionId) {
      const regionStore = useRegionStore.getState();
      regionStore.setRegion(regionId);
      
      setTimeout(() => {
        useClassStore.getState().fetchClasses();
      }, 0);
    }
    
    if (user && !user.location) {
      setShowSavePrompt(true);
    } else {
      setIsOpen(false);
    }
    
    setSearchTerm('');
    setSearchResults([]);
  };
  
  const handleSaveLocation = async () => {
    if (user && currentLocation) {
      const locationString = `${currentLocation.name}, ${currentLocation.parent?.name}`;
      try {
        await updateProfile({
          ...user,
          id: user.id,
          location: locationString,
        });
      } catch (error) {
        console.error('Error saving location:', error);
      }
    }
    setShowSavePrompt(false);
    setIsOpen(false);
  };
  
  const getLocationCountryCode = (location: Location | null): string => {
    if (!location?.parent?.name) return 'GB';
    const parts = location.parent.name.split(', ');
    const country = parts[parts.length - 1];
    
    const countryToCode: Record<string, string> = {
      'United Kingdom': 'GB',
      'United States': 'US',
      'Australia': 'AU',
      'Canada': 'CA',
      'New Zealand': 'NZ',
      'Ireland': 'IE',
      'France': 'FR',
      'Germany': 'DE',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Argentina': 'AR',
      'South Africa': 'ZA',
      'Russia': 'RU',
      'Singapore': 'SG',
      'South Korea': 'KR',
      'United Arab Emirates': 'AE',
      'Thailand': 'TH'
    };
    
    return countryToCode[country] || 'GB';
  };
  
  const displayedLocations = searchTerm.length >= 2 ? searchResults : recentLocations;
  
  const pickerContent = (
    <>
      {showSavePrompt ? (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Save Location?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Would you like to save {currentLocation?.name} as your default location?
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSavePrompt(false);
                setIsOpen(false);
              }}
            >
              No, thanks
            </Button>
            <Button
              size="sm"
              onClick={handleSaveLocation}
            >
              Yes, save it
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="py-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input text-foreground"
                placeholder="Search for your location..."
            
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="h-80">
            <Map
              locations={displayedLocations}
              onLocationSelect={handleLocationSelect}
              center={currentLocation?.coordinates ? 
                [currentLocation.coordinates.latitude, currentLocation.coordinates.longitude] :
                [51.5074, -0.1278]
              }
              zoom={currentLocation ? 12 : 6}
              height="100%"
            />
          </div>
          
          <div className="max-h-100 overflow-auto p-1 border-t border-border">
            {isSearching ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                Searching...
              </div>
            ) : displayedLocations.length > 0 ? (
              <div className="space-y-1">
                {searchTerm.length < 2 && recentLocations.length > 0 && (
                  <div className="px-2 py-3 text-xs font-medium text-muted-foreground uppercase">
                    Recent Locations
                  </div>
                )}
                {displayedLocations.map(location => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={cn(
                      "flex items-center w-full px-3 py-3 text-sm rounded-md hover:bg-muted",
                      currentLocation?.id === location.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="mr-2 text-xl leading-none">
                      {getCountryFlag(getLocationCountryCode(location))}
                    </span>
                    <div className="text-left truncate">
                      <div className="font-medium truncate">{location.name}</div>
                      {location.parent && (
                        <div className="text-xs text-muted-foreground truncate">
                          {location.parent.name}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                No locations found
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                Type to search for any location
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-input hover:shadow-md transition-all bg-background text-foreground"
        title={currentLocation ? `${currentLocation.name}, ${currentLocation.parent?.name}` : 'Select location'}
      >
        <span className="text-lg">
          {getCountryFlag(getLocationCountryCode(currentLocation))}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentLocation?.name || 'Select location'}
        </span>
      </button>
      
      {isOpen && modal ? (
        <Dialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setShowSavePrompt(false);
          }}
          title="Select Location"
          size="lg"
        >
          {pickerContent}
        </Dialog>
      ) : isOpen && (
        <div className="absolute z-50 w-96 mt-2 bg-card border border-border rounded-lg shadow-lg">
          {pickerContent}
        </div>
      )}
    </div>
  );
};
