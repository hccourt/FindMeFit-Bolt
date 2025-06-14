import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Dumbbell, MapPin, Star, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Map } from '../components/ui/Map';
import { ChatBox } from '../components/features/ChatBox';
import { useAuthStore, useClassStore, useRegionStore } from '../lib/store';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { Class } from '../lib/types';

export const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { classes, isLoading, fetchClasses, forceRefreshClasses, bookClass } = useClassStore();
  const { currentRegion } = useRegionStore();
  
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    forceRefreshClasses();
  }, [forceRefreshClasses]);
  
  useEffect(() => {
    if (classes.length > 0 && id) {
      const found = classes.find((c) => c.id === id);
      if (found) {
        setClassItem(found);
      }
    }
  }, [classes, id]);
  
  const handleBookClass = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!user || !classItem) return;
    
    try {
      setIsBooking(true);
      setBookingSuccess(false);
      
      await bookClass(classItem.id, user.id);
      
      // Force refresh to get updated participant count and booking status
      await forceRefreshClasses();
      
      setBookingSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to book class';
      alert(message);
    } finally {
      setIsBooking(false);
    }
  };
  
  if (isLoading || !classItem) {
    return (
      <Layout>
        <Container className="py-12">
          <div className="animate-pulse-subtle">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-8"></div>
            <div className="aspect-video bg-neutral-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-6"></div>
                
                <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3 mb-6"></div>
              </div>
              <div>
                <div className="h-[200px] bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-10 bg-neutral-200 rounded mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    );
  }
  
  const startDate = new Date(classItem.startTime);
  const endDate = new Date(classItem.endTime);
  const spotsLeft = classItem.maxParticipants - classItem.currentParticipants;
  const isFull = spotsLeft === 0;
  
  return (
    <Layout>
      <div className="bg-muted py-8">
        <Container>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <span className="text-muted-foreground">Classes</span>
            <span>›</span>
            <span className="text-primary">
              {classItem.type === 'personal' ? 'Personal Training' : 'Group Class'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{classItem.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-1" />
              <span className="text-foreground">
                {classItem.location.name}, {classItem.location.parent?.name}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-1" />
              <span className="text-foreground">{formatDate(startDate, currentRegion.dateLocale)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-1" />
              <span className="text-foreground">
                {formatTime(startDate, currentRegion.dateLocale)} - {formatTime(endDate, currentRegion.dateLocale)}
              </span>
            </div>
            <Badge variant={isFull ? 'error' : 'success'}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </Badge>
            <Badge variant={classItem.type === 'personal' ? 'primary' : 'default'}>
              {classItem.type === 'personal' ? 'Personal Training' : 'Group Class'}
            </Badge>
            <Badge variant="outline">
              {classItem.level.charAt(0).toUpperCase() + classItem.level.slice(1)} Level
            </Badge>
          </div>
        </Container>
      </div>
      
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={
                  classItem.imageUrl ||
                  'https://images.pexels.com/photos/4498604/pexels-photo-4498604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                }
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-foreground">About This Class</h2>
            <p className="text-muted-foreground mb-6">{classItem.description}</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Class Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Class Size</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.currentParticipants}/{classItem.maxParticipants} participants
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {(endDate.getTime() - startDate.getTime()) / (1000 * 60)} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Dumbbell className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Class Type</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.type === 'personal' ? 'Personal Training' : 'Group Class'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Skill Level</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.level.charAt(0).toUpperCase() + classItem.level.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Location</h3>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <p className="font-medium text-foreground">{classItem.location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {classItem.location.parent?.name}
                  </p>
                </div>
              </div>
              {classItem.location.coordinates && (
                <Map
                  center={[classItem.location.coordinates.latitude, classItem.location.coordinates.longitude]}
                  zoom={15}
                  locations={[classItem.location]}
                  height="300px"
                  className="rounded-lg overflow-hidden shadow-md"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">About the Instructor</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  src={classItem.instructor.profileImage}
                  name={classItem.instructor.name}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-lg text-foreground">{classItem.instructor.name}</p>
                  <div className="flex items-center mt-1">
                    <div className="text-yellow-400 flex">
                      ★★★★★
                    </div>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {classItem.instructor.rating} ({classItem.instructor.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {classItem.instructor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {classItem.instructor.bio ||
                  `Professional instructor with ${classItem.instructor.experience} years of experience in fitness coaching. Specializes in ${classItem.instructor.specialties.join(
                    ', '
                  )}.`}
              </p>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary">{formatCurrency(classItem.price, currentRegion)}</p>
                  <p className="text-muted-foreground text-sm">per session</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{formatDate(startDate, currentRegion.dateLocale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">
                      {formatTime(startDate, currentRegion.dateLocale)} - {formatTime(endDate, currentRegion.dateLocale)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground">{classItem.location.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spots Left</span>
                    <span className="font-medium text-foreground">{spotsLeft}</span>
                  </div>
                </div>
                
                {bookingSuccess ? (
                  <div className="bg-success-100 dark:bg-success-900/20 text-success-900 dark:text-success-300 p-4 rounded-lg text-center mb-4 border border-success-200 dark:border-success-800">
                    <p className="font-medium">Booking Confirmed!</p>
                    <p className="text-sm mt-1">
                      You're all set for {formatDate(startDate, currentRegion.dateLocale)} at {formatTime(startDate, currentRegion.dateLocale)}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => setShowChat(true)}
                    >
                      Open Chat
                    </Button>
                  </div>
                ) : classItem.isBooked ? (
                  <div className="bg-primary/10 text-primary p-4 rounded-lg text-center mb-4 border border-primary/20">
                    <p className="font-medium">You're already booked!</p>
                    <p className="text-sm mt-1">
                      View your booking in the dashboard
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => setShowChat(true)}
                    >
                      Open Chat
                    </Button>
                  </div>
                ) : user?.id === classItem.instructor.id ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => setShowChat(true)}
                  >
                    View Class Chat
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    isLoading={isBooking}
                    disabled={isFull || isBooking}
                    onClick={handleBookClass}
                  >
                    {isFull ? 'Class Full' : 'Book Now'}
                  </Button>
                )}
                
                {(classItem.isBooked || bookingSuccess) && (
                  <Button
                    fullWidth
                    variant="outline"
                    className="mt-3"
                    onClick={() => navigate('/dashboard')}
                  >
                    View My Bookings
                  </Button>
                )}
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  No payment required now. Pay at the venue.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Box */}
          <ChatBox
            classId={classItem.id}
            isOpen={showChat}
            onClose={() => setShowChat(false)}
          />
        </div>
      </Container>
    </Layout>
  );
};