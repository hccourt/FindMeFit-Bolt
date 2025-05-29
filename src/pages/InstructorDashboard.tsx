import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Calendar, Clock, MapPin, Plus, Users, Search } from 'lucide-react';
import { CreateClassForm } from '../components/features/CreateClassForm';
import { useAuthStore, useClassStore, useRegionStore } from '../lib/store';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { Class } from '../lib/types';

export const InstructorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { classes, isLoading, fetchClasses } = useClassStore();
  const { currentRegion } = useRegionStore();
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  
  React.useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user, fetchClasses]);
  
  const instructorClasses = classes.filter(c => c.instructor.email === user?.email);
  
  const upcomingClasses = instructorClasses.filter(
    c => new Date(c.startTime) > new Date()
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const pastClasses = instructorClasses.filter(
    c => new Date(c.startTime) <= new Date()
  ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  return (
    <Layout>
      <div className="bg-muted py-8">
        <Container>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Instructor Dashboard</h1>
              <p className="text-muted-foreground">Manage your classes and clients</p>
            </div>
            <Button
              onClick={() => setShowNewClassForm(true)}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              Create New Class
            </Button>
          </div>
        </Container>
      </div>
      
      {showNewClassForm && (
        <CreateClassForm onClose={() => setShowNewClassForm(false)} />
      )}
      
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Total Classes</p>
                      <p className="text-2xl font-bold text-neutral-900">{instructorClasses.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Total Students</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {instructorClasses.reduce((acc, c) => acc + c.currentParticipants, 0)}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Revenue</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatCurrency(
                          instructorClasses.reduce((acc, c) => acc + (c.price * c.currentParticipants), 0),
                          currentRegion
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">$</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
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
                ) : upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingClasses.map(classItem => (
                      <div
                        key={classItem.id}
                        className="flex items-center p-4 border rounded-lg hover:border-primary-500 transition-colors"
                      >
                        <img
                          src={classItem.imageUrl}
                          alt={classItem.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{classItem.title}</h3>
                            <Badge variant={classItem.type === 'personal' ? 'primary' : 'default'}>
                              {classItem.type === 'personal' ? 'Personal Training' : 'Group Class'}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-neutral-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDate(new Date(classItem.startTime), currentRegion.dateLocale)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>
                                {formatTime(new Date(classItem.startTime), currentRegion.dateLocale)} - 
                                {formatTime(new Date(classItem.endTime), currentRegion.dateLocale)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{classItem.location.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              <span>
                                {classItem.currentParticipants}/{classItem.maxParticipants} participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link to={`/classes/${classItem.id}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No upcoming classes</h3>
                    <p className="text-neutral-600 mb-4">
                      You haven't created any upcoming classes yet.
                    </p>
                    <Button onClick={() => setShowNewClassForm(true)}>Create Class</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Past Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Past Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {pastClasses.length > 0 ? (
                  <div className="space-y-4">
                    {pastClasses.map(classItem => (
                      <div
                        key={classItem.id}
                        className="flex items-center p-4 border rounded-lg bg-neutral-50"
                      >
                        <img
                          src={classItem.imageUrl}
                          alt={classItem.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium">{classItem.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-neutral-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(new Date(classItem.startTime), currentRegion.dateLocale)}</span>
                            <span className="mx-2">•</span>
                            <Users className="w-4 h-4 mr-2" />
                            <span>{classItem.currentParticipants} participants</span>
                          </div>
                        </div>
                        <div>
                          <Link to={`/classes/${classItem.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-600">
                    No past classes to show
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search classes..."
                    type="search"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Class Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500"
                        />
                        <span className="ml-2 text-sm">Group Classes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500"
                        />
                        <span className="ml-2 text-sm">Personal Training</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Status
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500"
                        />
                        <span className="ml-2 text-sm">Upcoming</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500"
                        />
                        <span className="ml-2 text-sm">Past</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500"
                        />
                        <span className="ml-2 text-sm">Cancelled</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" fullWidth leftIcon={<Plus className="h-4 w-4" />}>
                    New Class
                  </Button>
                  <div className="h-1" />
                  <Link to="/discover">
                    <Button variant="outline" fullWidth leftIcon={<Search className="h-4 w-4" />}>
                      Discover Classes
                    </Button>
                  </Link>
                  <Button variant="outline" fullWidth leftIcon={<Users className="h-4 w-4" />}>
                    View All Students
                  </Button>
                  <Button variant="outline" fullWidth leftIcon={<Calendar className="h-4 w-4" />}>
                    Manage Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Layout>
  );
};