import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Shield, 
  Clock,
  Users,
  Heart,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Find the perfect instructor or class using our smart search and filtering system."
  },
  {
    icon: MapPin,
    title: "Local & Convenient",
    description: "Discover fitness options in your area with our location-based search and interactive map."
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description: "Book sessions that fit your schedule with instant confirmation and easy cancellation."
  },
  {
    icon: Star,
    title: "Verified Instructors",
    description: "All instructors are certified and verified, with real reviews from other clients."
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your personal information and bookings are protected with enterprise-grade security."
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Get instant notifications about your bookings, schedule changes, and new classes."
  }
];

const classTypes = [
  {
    title: "Personal Training",
    description: "One-on-one sessions tailored to your specific goals and fitness level.",
    image: "https://images.pexels.com/photos/4498604/pexels-photo-4498604.jpeg?auto=compress&cs=tinysrgb&w=600",
    benefits: ["Personalized attention", "Custom workout plans", "Flexible scheduling", "Goal-focused training"]
  },
  {
    title: "Group Classes",
    description: "Join others in motivating group sessions led by certified instructors.",
    image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600",
    benefits: ["Social motivation", "Cost-effective", "Variety of classes", "Community building"]
  },
  {
    title: "Specialized Programs",
    description: "Targeted programs for specific goals like weight loss, strength, or rehabilitation.",
    image: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=600",
    benefits: ["Expert guidance", "Structured progression", "Measurable results", "Ongoing support"]
  }
];

const testimonials = [
  {
    name: "Jennifer Martinez",
    image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "FindMeFit helped me find an amazing personal trainer who understood my goals. I've lost 20 pounds and feel stronger than ever!",
    rating: 5,
    location: "Oxford"
  },
  {
    name: "David Wilson",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "The group yoga classes I found through FindMeFit have become the highlight of my week. Great instructors and lovely people.",
    rating: 5,
    location: "Kidlington"
  },
  {
    name: "Emma Thompson",
    image: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "As a busy mum, I love how easy it is to find and book fitness classes that fit around my schedule. Game changer!",
    rating: 5,
    location: "Banbury"
  }
];

export const ClientsPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Fitness Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Connect with certified fitness professionals in your area. Whether you're just starting out 
              or looking to reach new goals, we'll help you find the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Find Classes Near You
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Browse Instructors
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Certified Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1K+</div>
              <div className="text-muted-foreground">Weekly Classes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Locations</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose FindMeFit?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We make it simple to find, book, and attend fitness sessions that match your goals, 
            schedule, and budget.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Class Types */}
      <div className="bg-muted py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Fit
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you prefer one-on-one attention or the energy of group classes, 
              we have options for every fitness style and goal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {classTypes.map((type, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-[4/3]">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* How It Works */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Getting started is simple. Follow these three steps to begin your fitness journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Search & Discover
              </h3>
              <p className="text-muted-foreground">
                Browse classes and instructors in your area. Use filters to find exactly what you're looking for.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Book Your Session
              </h3>
              <p className="text-muted-foreground">
                Choose a time that works for you and book instantly. Get confirmation and all the details you need.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Achieve Your Goals
              </h3>
              <p className="text-muted-foreground">
                Attend your session and work towards your fitness goals with professional guidance and support.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* Testimonials */}
      <div className="bg-muted py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from clients who have achieved their fitness goals with help from our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of people who have found their perfect fitness match on FindMeFit. 
              Your goals are waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up Free
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Explore Classes
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
