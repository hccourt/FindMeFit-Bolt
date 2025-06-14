import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../lib/store';
import { Camera, Mail, MapPin, Phone, User } from 'lucide-react';

// Mock location data - in a real app, this would come from an API
const mockLocations = [
  'London, UK',
  'Manchester, UK',
  'Birmingham, UK',
  'Liverpool, UK',
  'Glasgow, UK',
  'Edinburgh, UK',
  'Bristol, UK',
  'Leeds, UK',
  'Newcastle, UK',
  'Sheffield, UK',
  'Nottingham, UK',
  'Cardiff, UK',
  'Belfast, UK',
  'Oxford, UK',
  'Cambridge, UK'
];

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, updateProfile } = useAuthStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-primary-100 text-primary-800';
      case 'admin':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-success-100 text-success-800';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
    
    // Handle location suggestions
    if (name === 'location') {
      const suggestions = mockLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(suggestions);
      setShowSuggestions(value.length > 0);
    }
  };
  
  const handleLocationSelect = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location,
    }));
    setShowSuggestions(false);
  };
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
    };
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await updateProfile({
        ...user,
        ...formData,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <Layout>
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getRoleBadgeColor(user.role)}`}>
              {user.role} Account
            </span>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar
                      src={user.profileImage}
                      name={user.name}
                      size="xl"
                      className="h-24 w-24"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Click to upload a new photo
                  </p>
                </div>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    leftIcon={<User size={18} />}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    leftIcon={<Mail size={18} />}
                  />
                  
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    leftIcon={<Phone size={18} />}
                  />
                  
                  <div className="relative">
                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                      leftIcon={<MapPin size={18} />}
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                      >
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="flex items-center">
                              <MapPin size={16} className="text-neutral-500 mr-2" />
                              <span>{location}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-destructive">{errors.bio}</p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
