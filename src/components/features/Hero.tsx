import React from 'react';
import { ArrowRight, Calendar, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Find Your Perfect <span className="text-primary-500">Fitness Match</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with top fitness instructors for personalized training or join group classes that match your goals and schedule.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 transition-all duration-200">
              <div className="flex-1 min-w-0 px-4">
                <input
                  type="text"
                  placeholder="Search classes, trainers, or locations"
                  className="w-full h-12 bg-transparent border-0 focus:ring-0 focus:outline-none text-lg text-neutral-900 placeholder:text-neutral-500"
                />
              </div>
              <Button size="lg" className="rounded-full px-8">
                Search
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
                <User size={24} />
              </div>
              <p className="font-semibold text-foreground">500+</p>
              <p className="text-muted-foreground">Certified Trainers</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
                <Calendar size={24} />
              </div>
              <p className="font-semibold text-foreground">1,000+</p>
              <p className="text-muted-foreground">Weekly Classes</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
                <MapPin size={24} />
              </div>
              <p className="font-semibold text-foreground">50+</p>
              <p className="text-muted-foreground">Locations</p>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full bg-primary/20 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full bg-accent/20 opacity-50 blur-3xl"></div>
    </div>
  );
};