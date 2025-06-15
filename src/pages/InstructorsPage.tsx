import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  CheckCircle, 
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: "Grow Your Client Base",
    description: "Connect with fitness enthusiasts in your area who are actively looking for qualified instructors."
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Set your own schedule and availability. Create classes that work around your lifestyle."
  },
  {
    icon: DollarSign,
    title: "Set Your Own Rates",
    description: "You control your pricing. Keep the majority of your earnings with our low commission structure."
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Collect reviews and ratings to showcase your expertise and attract more clients."
  },
  {
    icon: CheckCircle,
    title: "Verified Profile",
    description: "Get verified status to build trust with potential clients and stand out from the competition."
  },
  {
    icon: TrendingUp,
    title: "Business Growth Tools",
    description: "Access analytics and insights to understand your performance and grow your fitness business."
  }
];

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description: "Sign up as an instructor and complete your profile with certifications, experience, and specialties."
  },
  {
    number: "2",
    title: "Get Verified",
    description: "Upload your qualifications and certifications. Our team will verify your credentials within 2-3 business days."
  },
  {
    number: "3",
    title: "Create Classes",
    description: "Set up your first classes with details about location, pricing, and what clients can expect."
  },
  {
    number: "4",
    title: "Start Teaching",
    description: "Clients can discover and book your classes. Focus on what you do best - helping people achieve their fitness goals."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    specialty: "Yoga & Pilates",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "FindMeFit has transformed my fitness business. I've tripled my client base in just 6 months and love the flexibility it gives me.",
    rating: 5,
    clients: 150
  },
  {
    name: "Mike Thompson",
    specialty: "Personal Training",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "The platform makes it so easy to manage my schedule and connect with motivated clients. The verification system builds real trust.",
    rating: 5,
    clients: 89
  },
  {
    name: "Emma Davis",
    specialty: "Group Fitness",
    image: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "I love how FindMeFit handles all the booking logistics so I can focus on creating amazing fitness experiences for my clients.",
    rating: 5,
    clients: 200
  }
];

export const InstructorsPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Grow Your Fitness Business
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Join hundreds of certified instructors who are building successful fitness 
              businesses on FindMeFit. Connect with motivated clients and take control of your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Start Teaching Today
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Learn More
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
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Classes Booked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Instructor Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">£2M+</div>
              <div className="text-muted-foreground">Instructor Earnings</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose FindMeFit?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide everything you need to build and grow a successful fitness business, 
            from client acquisition to payment processing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* How It Works */}
      <div className="bg-muted py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting started is simple. Follow these four steps to begin building your fitness business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* Testimonials */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from instructors who have built thriving businesses on our platform.
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
                    <p className="text-sm text-primary">{testimonial.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {testimonial.clients} clients
                  </span>
                </div>
                
                <p className="text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Pricing */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              No monthly fees, no setup costs. We only succeed when you do.
            </p>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">5%</div>
                <div className="text-lg font-semibold text-foreground mb-4">Commission per booking</div>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                    <span className="text-muted-foreground">No monthly fees</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                    <span className="text-muted-foreground">No setup costs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                    <span className="text-muted-foreground">Keep 95% of your earnings</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                    <span className="text-muted-foreground">Weekly payouts</span>
                  </div>
                </div>
                <Button className="w-full">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join the FindMeFit community today and start building the fitness business you've always wanted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up as Instructor
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Contact Sales
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
