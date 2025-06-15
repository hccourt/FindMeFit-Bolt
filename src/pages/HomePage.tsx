import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { ClassCard } from '../components/features/ClassCard';
import { Hero } from '../components/features/Hero';
import { useClassStore, useLocationStore } from '../lib/store';
import { isCoordinateInRegion } from '../lib/utils';

export const HomePage: React.FC = () => {
  const { classes, fetchClasses, isLoading } = useClassStore();
  const { regionSettings: currentRegion } = useLocationStore();
  const { currentLocation } = useLocationStore();
  
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, currentRegion.id]);

  const filteredClasses = React.useMemo(() => {
    if (!currentRegion || !currentRegion.bounds) {
      return [];
    }

    return classes.filter(classItem => {
      if (!classItem.location.coordinates) return false;
      return isCoordinateInRegion(
        classItem.location.coordinates.latitude,
        classItem.location.coordinates.longitude,
        currentRegion.bounds
      );
    });
  }, [classes, currentRegion]);
  
  return (
    <Layout>
      <Hero />
      
      {/* Featured Classes Section */}
      <section className="py-16 bg-background">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {currentLocation ? `Featured Classes in ${currentLocation.name}` : 'Featured Classes'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {currentLocation 
                  ? 'Discover our most popular fitness experiences' 
                  : 'Set your location to discover fitness classes near you'
                }
              </p>
            </div>
            <Link to="/discover">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </div>
          
          {!currentLocation ? (
            <div className="text-center py-12 bg-muted rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Set Your Location</h3>
              <p className="text-muted-foreground mb-6">
                Choose your location to discover fitness classes and trainers in your area.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the location picker in the top navigation to get started.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-muted h-[400px] animate-pulse-subtle"
                  ></div>
                ))}
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.slice(0, 3).map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">No Classes Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no featured classes in {currentLocation.name}.
              </p>
              <Link to="/discover">
                <Button>Browse All Classes</Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">How FindMeFit Works</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find and book fitness sessions with top instructors in your area
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 21h-10a3.5 3.5 0 0 1 0-7h.5"></path>
                  <path d="M9.5 4h10a3.5 3.5 0 0 1 0 7h-.5"></path>
                  <path d="M3 3v18"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Connect</h3>
              <p className="text-muted-foreground">
                Create your profile and connect with certified fitness instructors that match your preferences
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="22" y1="12" x2="18" y2="12"></line>
                  <line x1="6" y1="12" x2="2" y2="12"></line>
                  <line x1="12" y1="6" x2="12" y2="2"></line>
                  <line x1="12" y1="22" x2="12" y2="18"></line>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Book</h3>
              <p className="text-muted-foreground">
                Browse and book group classes or personal training sessions with just a few clicks
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 14 1.09-1.09a2 2 0 0 0 0-2.82L13.4 4.4a2 2 0 0 0-2.82 0L9.5 5.5"></path>
                  <path d="M5.5 9.5 4.4 10.6a2 2 0 0 0 0 2.82L10.1 19.1a2 2 0 0 0 2.82 0l1.09-1.09"></path>
                  <line x1="8" y1="14" x2="6" y2="12"></line>
                  <line x1="12" y1="12" x2="6" y2="6"></line>
                  <line x1="16" y1="8" x2="18" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Achieve</h3>
              <p className="text-muted-foreground">
                Track your progress, attend sessions, and reach your fitness goals with professional guidance
              </p>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Our Users Say</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Read testimonials from clients and instructors who've found success with FindMeFit
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-card-foreground">Jennifer L.</p>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">★★★★★</div>
              <p className="text-muted-foreground">
                "FindMeFit made it incredibly easy to find a personal trainer who understood my goals. I've been working with Sarah for 3 months, and I've never felt stronger!"
              </p>
            </div>
            
            <div className="bg-card border border-border/50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Instructor"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-card-foreground">Michael R.</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">★★★★★</div>
              <p className="text-muted-foreground">
                "As a fitness instructor, FindMeFit has helped me grow my client base and manage my schedule efficiently. The platform is intuitive and professional."
              </p>
            </div>
            
            <div className="bg-card border border-border/50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-card-foreground">David K.</p>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-3">★★★★★</div>
              <p className="text-muted-foreground">
                "I love how easy it is to discover and book fitness classes in my area. The interactive map feature helped me find a great yoga studio just a few blocks from my home!"
              </p>
            </div>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to start your fitness journey?</h2>
              <p className="mt-3 text-primary-100">
                Join thousands of users finding their perfect fitness match today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary-500 hover:bg-neutral-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/discover">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-500 bg-transparent">
                  Explore Classes
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};