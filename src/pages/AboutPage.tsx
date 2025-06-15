import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { MapPin, Users, Award, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About FindMeFit
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're passionate about connecting people with the right fitness professionals 
              to help them achieve their health and wellness goals. Based in Oxfordshire, 
              we serve communities across the UK.
            </p>
          </div>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              At FindMeFit, we believe that everyone deserves access to quality fitness 
              instruction that fits their lifestyle, goals, and budget. Our platform 
              bridges the gap between certified fitness professionals and individuals 
              seeking personalized guidance on their wellness journey.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're looking for group classes to stay motivated with others, 
              or one-on-one personal training for focused attention, we make it easy 
              to find, book, and attend sessions that work for you.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Fitness training session"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </Container>

      {/* Values Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at FindMeFit
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground text-sm">
                  Building connections between fitness professionals and clients
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quality</h3>
                <p className="text-muted-foreground text-sm">
                  Ensuring all instructors meet our high standards of certification
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Wellness</h3>
                <p className="text-muted-foreground text-sm">
                  Promoting holistic health and sustainable fitness practices
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Accessibility</h3>
                <p className="text-muted-foreground text-sm">
                  Making fitness accessible to everyone, everywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>

      {/* Team Section */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals behind FindMeFit, working to revolutionize 
            how people connect with fitness professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400"
                name="James Mitchell"
                size="xl"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-1">James Mitchell</h3>
              <p className="text-primary text-sm mb-3">Founder & CEO</p>
              <p className="text-muted-foreground text-sm">
                Former personal trainer with 10+ years experience, passionate about 
                making fitness accessible to everyone.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar
                src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400"
                name="Sarah Thompson"
                size="xl"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-1">Sarah Thompson</h3>
              <p className="text-primary text-sm mb-3">Head of Operations</p>
              <p className="text-muted-foreground text-sm">
                Ensures our platform runs smoothly and our community of instructors 
                and clients have the best experience possible.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar
                src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400"
                name="David Chen"
                size="xl"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-1">David Chen</h3>
              <p className="text-primary text-sm mb-3">Lead Developer</p>
              <p className="text-muted-foreground text-sm">
                Builds and maintains our platform, ensuring it's user-friendly, 
                secure, and constantly improving.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* Contact CTA */}
      <div className="bg-primary text-white py-16">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our community of fitness enthusiasts and professionals. 
              Whether you're looking to get fit or share your expertise, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Join as Client
              </a>
              <a
                href="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
              >
                Become an Instructor
              </a>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
