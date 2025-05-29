import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Map } from '../ui/Map';
import { useAuthStore, useClassStore } from '../../lib/store';
import { searchLocations } from '../../lib/geocoding';
import { Location } from '../../lib/types';

interface CreateClassFormProps {
  onClose: () => void;
}

interface VenueDetails {
  name: string;
  address: string;
  city: string;
  coordinates: [number, number];
}

interface ClassFormData {
  title: string;
  description: string;
  venue: VenueDetails;
  startTime: string;
  endTime: string;
  price: number;
  maxParticipants: number;
  type: 'group' | 'personal';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags: string;
  imageUrl: string;
}

export const CreateClassForm: React.FC<CreateClassFormProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { createClass, isLoading } = useClassStore();
  const [searchResults, setSearchResults] = React.useState<Location[]>([]);
  const [selectedVenue, setSelectedVenue] = React.useState<VenueDetails | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClassFormData>();
  
  const locationSearch = watch('venue.name', '');
  
  React.useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (locationSearch.length >= 3) {
        setIsSearching(true);
        const results = await searchLocations(locationSearch);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [locationSearch]);
  
  const handleVenueSelect = (location: Location) => {
    if (!location.coordinates) return;
    
    const venue: VenueDetails = {
      name: location.name,
      address: location.parent?.name || '',
      city: location.parent?.name?.split(', ')[0] || '',
      coordinates: [location.coordinates.latitude, location.coordinates.longitude]
    };
    
    setSelectedVenue(venue);
  };
  
  const onSubmit = async (data: ClassFormData) => {
    if (!user) return;
    
    try {
      const tags = data.tags.split(',').map(tag => tag.trim());
      
      if (!selectedVenue) {
        throw new Error('Please select a valid venue');
      }
      
      await createClass({
        title: data.title,
        description: data.description,
        instructor_id: user.id,
        location_name: selectedVenue.name,
        location_address: selectedVenue.address,
        location_city: selectedVenue.city,
        location_coordinates: `(${selectedVenue.coordinates[0]},${selectedVenue.coordinates[1]})`,
        start_time: new Date(data.startTime).toISOString(),
        end_time: new Date(data.endTime).toISOString(),
        price: data.price,
        max_participants: data.maxParticipants,
        type: data.type,
        level: data.level,
        tags,
        image_url: data.imageUrl,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Create New Class</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Title"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Venue Location
                  </label>
                  <div className="space-y-4">
                    <Controller
                      name="venue.name"
                      control={control}
                      rules={{ required: 'Venue is required' }}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            placeholder="Search for a venue..."
                            {...field}
                            error={errors.venue?.name?.message}
                          />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                            </div>
                          )}
                          {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {searchResults.map((location) => (
                                <button
                                  key={location.id}
                                  type="button"
                                  className="w-full px-4 py-2 text-left hover:bg-neutral-50"
                                  onClick={() => {
                                    handleVenueSelect(location);
                                    field.onChange(location.name);
                                    setSearchResults([]);
                                  }}
                                >
                                  <div className="font-medium">{location.name}</div>
                                  {location.parent && (
                                    <div className="text-sm text-neutral-500">
                                      {location.parent.name}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    
                    {selectedVenue && (
                      <div className="rounded-lg overflow-hidden border border-neutral-200">
                        <Map
                          center={selectedVenue.coordinates}
                          zoom={15}
                          locations={[{
                            id: 'selected-venue',
                            name: selectedVenue.name,
                            type: 'city',
                            coordinates: {
                              latitude: selectedVenue.coordinates[0],
                              longitude: selectedVenue.coordinates[1]
                            }
                          }]}
                          height="200px"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Input
                  label="Image URL"
                  {...register('imageUrl')}
                  error={errors.imageUrl?.message}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Start Time"
                  {...register('startTime', { required: 'Start time is required' })}
                  error={errors.startTime?.message}
                />
                
                <Input
                  type="datetime-local"
                  label="End Time"
                  {...register('endTime', { required: 'End time is required' })}
                  error={errors.endTime?.message}
                />
                
                <Input
                  type="number"
                  label="Price"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  error={errors.price?.message}
                />
                
                <Input
                  type="number"
                  label="Max Participants"
                  {...register('maxParticipants', {
                    required: 'Max participants is required',
                    min: { value: 1, message: 'Must allow at least 1 participant' }
                  })}
                  error={errors.maxParticipants?.message}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Class Type
                  </label>
                  <select
                    {...register('type', { required: 'Class type is required' })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="group">Group Class</option>
                    <option value="personal">Personal Training</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Skill Level
                  </label>
                  <select
                    {...register('level', { required: 'Skill level is required' })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                  {errors.level && (
                    <p className="mt-1 text-sm text-destructive">{errors.level.message}</p>
                  )}
                </div>
              </div>
              
              <Input
                label="Tags (comma-separated)"
                {...register('tags')}
                placeholder="yoga, meditation, morning"
                error={errors.tags?.message}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-border">
              {selectedVenue && (
                <div className="flex-1 text-sm text-neutral-600">
                  Selected venue: <span className="font-medium">{selectedVenue.name}</span>
                </div>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Create Class
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};