import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Calendar, Clock, MapPin, User, Mail, Phone, Calendar as JoinedIcon } from 'lucide-react';
import { useAuthStore, useClassStore, useRegionStore } from '../lib/store';
import { formatDate, formatTime } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, classes, fetchBookings, fetchClasses, isLoading } = useClassStore();
  const { currentRegion } = useRegionStore();

  // Ensure we have both classes and bookings loaded
  React.useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await Promise.all([
            fetchClasses(),
            fetchBookings(user.id)
          ]);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      }
    };
    
    loadData();
  }, [user, fetchClasses, fetchBookings, user?.id]);
  
  const upcomingBookings = React.useMemo(() => {
    if (!bookings || !classes) return [];
    
    // For instructors, show their created classes
    if (user?.role === 'instructor') {
      return classes
        .filter(c => c.instructor.id === user.id)
        .filter(c => new Date(c.startTime) > new Date())
        .sort((a, b) => 
          new Date(a.startTime).getTime() - 
          new Date(b.startTime).getTime()
        )
        .map(classItem => ({
          id: classItem.id,
          status: 'instructor',
          classDetails: classItem
        }));
    }
    
    // For clients, show their booked classes
    return bookings
      .filter(booking => booking.status === 'confirmed')
      .map(booking => {
        const classDetails = classes.find(c => c.id === booking.class_id);
        return classDetails ? { ...booking, classDetails } : null;
      })
      .filter((booking): booking is NonNullable<typeof booking> => {
        if (!booking || !booking.classDetails) return false;
        return new Date(booking.classDetails.startTime) > new Date();
      })
      .sort((a, b) => 
        new Date(a.classDetails.startTime).getTime() - 
        new Date(b.classDetails.startTime).getTime()
      );
  }, [bookings, classes]);
  
  const completedBookings = React.useMemo(() => {
    if (!bookings || !classes) return [];
    
    // For instructors, show their past classes
    if (user?.role === 'instructor') {
      return classes
        .filter(c => c.instructor.id === user.id)
        .filter(c => new Date(c.startTime) <= new Date())
        .sort((a, b) => 
          new Date(b.startTime).getTime() - 
          new Date(a.startTime).getTime()
        )
        .map(classItem => ({
          id: classItem.id,
          status: 'instructor',
          classDetails: classItem
        }));
    }
    
    // For clients, show their completed bookings
    return bookings
      .filter(booking => booking.status === 'confirmed')
      .map(booking => {
        const classDetails = classes.find(c => c.id === booking.class_id);
        return classDetails ? { ...booking, classDetails } : null;
      })
      .filter((booking): booking is NonNullable<typeof booking> => {
        if (!booking || !booking.classDetails) return false;
        return new Date(booking.classDetails.startTime) <= new Date();
      })
      .sort((a, b) => 
        new Date(b.classDetails.startTime).getTime() - 
        new Date(a.classDetails.startTime).getTime()
      );
  }, [bookings, classes]);
  
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
  
  if (!user) {
    return (
      <Layout>
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-muted py-8">
        <Container>
          <div className="flex items-center space-x-4">
            <Avatar src={user.profileImage} name={user.name} size="lg" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name}</h1>
                <span className={`px-2 py-0.5 text-sm font-medium rounded-full capitalize ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-muted-foreground">Manage your bookings and profile</p>
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-neutral-100 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="flex items-center p-4 border rounded-lg hover:border-primary-500 transition-colors"
                      >
                        <img
                          src={booking.classDetails?.imageUrl || 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg'}
                          alt={booking.classDetails?.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-lg">
                            {booking.classDetails?.title}
                          </h3>
                          <div className="mt-2 space-y-1 text-sm text-neutral-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDate(new Date(booking.classDetails.startTime), currentRegion.dateLocale)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>
                                {formatTime(new Date(booking.classDetails.startTime), currentRegion.dateLocale)} - 
                                {formatTime(new Date(booking.classDetails.endTime), currentRegion.dateLocale)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{booking.classDetails?.location.name}</span>
                            </div>
                          </div>
                        </div>
                        <Link to={`/classes/${booking.classDetails?.id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {user.role === 'instructor' ? 'No upcoming classes created' : 'No upcoming classes'}
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {user.role === 'instructor' 
                        ? "You haven't created any classes yet."
                        : "You haven't booked any classes yet. Start exploring classes to book your next session."
                      }
                    </p>
                    <Link to={user.role === 'instructor' ? '/instructor' : '/discover'}>
                      <Button>
                        {user.role === 'instructor' ? 'Create Class' : 'Browse Classes'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Activity History */}
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                {completedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {completedBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="flex items-center p-4 border rounded-lg bg-neutral-50"
                      >
                        <img
                          src={booking.classDetails?.imageUrl || 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg'}
                          alt={booking.classDetails?.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <h4 className="font-medium">{booking.classDetails?.title}</h4>
                          <p className="text-sm text-neutral-600">
                            {formatDate(new Date(booking.classDetails.startTime), currentRegion.dateLocale)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-600">
                    No past activities to show
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar src={user.profileImage} name={user.name} size="xl" />
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <span className={`inline-block px-2 py-0.5 text-sm font-medium rounded-full capitalize mt-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.role} Account
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t border-neutral-200 pt-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Phone</p>
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Location</p>
                        <p className="font-medium">{user.location || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <JoinedIcon className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Member Since</p>
                        <p className="font-medium">{formatDate(user.joined, currentRegion.dateLocale)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/profile/${user.id}`} className="block mt-6">
                    <Button variant="outline" fullWidth>Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">
                      {upcomingBookings.length}
                    </p>
                    <p className="text-sm text-neutral-600">Upcoming</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">
                      {completedBookings.length}
                    </p>
                    <p className="text-sm text-neutral-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Layout>
  );
};