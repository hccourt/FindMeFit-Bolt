import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Trophy, 
  Heart,
  TrendingUp,
  Star,
  MapPin
} from 'lucide-react';

const communityStats = [
  {
    icon: Users,
    value: "5,000+",
    label: "Community Members"
  },
  {
    icon: MessageCircle,
    value: "500+",
    label: "Daily Conversations"
  },
  {
    icon: Calendar,
    value: "100+",
    label: "Weekly Events"
  },
  {
    icon: Trophy,
    value: "1,000+",
    label: "Goals Achieved"
  }
];

const featuredMembers = [
  {
    name: "Sarah Johnson",
    role: "Yoga Instructor",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    achievement: "Top Rated Instructor 2024",
    specialties: ["Hatha Yoga", "Meditation", "Mindfulness"],
    rating: 4.9,
    location: "Oxford"
  },
  {
    name: "Mike Thompson",
    role: "Personal Trainer",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    achievement: "Transformation Coach of the Year",
    specialties: ["Weight Loss", "Strength Training", "Nutrition"],
    rating: 4.8,
    location: "Kidlington"
  },
  {
    name: "Emma Davis",
    role: "Group Fitness Leader",
    image: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    achievement: "Community Builder Award",
    specialties: ["HIIT", "Dance Fitness", "Bootcamp"],
    rating: 4.9,
    location: "Banbury"
  }
];

const successStories = [
  {
    name: "Jennifer Martinez",
    image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    story: "Lost 30 pounds and gained confidence",
    quote: "The FindMeFit community supported me every step of the way. From finding the right trainer to celebrating milestones, I never felt alone in my journey.",
    duration: "6 months",
    instructor: "Mike Thompson"
  },
  {
    name: "David Wilson",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    story: "Completed first marathon at age 45",
    quote: "I never thought I could run a marathon. The running group I found through FindMeFit made it possible. We trained together and crossed the finish line together.",
    duration: "8 months",
    instructor: "Emma Davis"
  },
  {
    name: "Lisa Chen",
    image: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    story: "Overcame anxiety through yoga",
    quote: "Sarah's yoga classes became my sanctuary. The community welcomed me with open arms and helped me find peace and strength I didn't know I had.",
    duration: "4 months",
    instructor: "Sarah Johnson"
  }
];

const upcomingEvents = [
  {
    title: "Community Fitness Challenge",
    date: "2024-02-15",
    time: "10:00 AM",
    location: "Oxford Community Center",
    participants: 45,
    type: "Challenge"
  },
  {
    title: "Instructor Meet & Greet",
    date: "2024-02-18",
    time: "7:00 PM",
    location: "Kidlington Sports Hall",
    participants: 28,
    type: "Social"
  },
  {
    title: "Wellness Workshop",
    date: "2024-02-22",
    time: "2:00 PM",
    location: "Online",
    participants: 67,
    type: "Workshop"
  }
];

export const CommunityPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Fitness Community
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Connect with like-minded fitness enthusiasts, share your journey, 
              and find motivation in our supportive community of instructors and clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Join the Community
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Explore Events
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Community Stats */}
      <div className="bg-muted py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* Featured Members */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Community Members
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet some of the amazing instructors and clients who make our community special.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <Avatar
                  src={member.image}
                  name={member.name}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <Badge variant="success" className="mb-3">
                  {member.achievement}
                </Badge>
                
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{member.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">rating</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.specialties.map((specialty, specialtyIndex) => (
                    <Badge key={specialtyIndex} variant="outline" size="sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Success Stories */}
      <div className="bg-muted py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real transformations from real people in our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar
                      src={story.image}
                      name={story.name}
                      size="md"
                      className="mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{story.name}</h4>
                      <p className="text-sm text-primary">{story.story}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground italic mb-4">
                    "{story.quote}"
                  </p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{story.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">with {story.instructor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* Upcoming Events */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming Community Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for exciting events, challenges, and workshops designed to bring our community together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{event.type}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.participants} attending</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Join Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Community Guidelines */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Community Guidelines
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our community thrives on respect, support, and shared goals. Here's how we maintain 
              a positive environment for everyone.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Heart className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Be Supportive</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Encourage others, celebrate achievements, and offer help when needed. 
                    We're all on this journey together.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Users className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Respect Everyone</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Treat all members with kindness and respect, regardless of their fitness level 
                    or background.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Share Knowledge</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Share tips, experiences, and insights that can help others on their 
                    fitness journey.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Trophy className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Stay Positive</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Focus on progress, not perfection. Every step forward is worth celebrating, 
                    no matter how small.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Become part of a supportive network of fitness enthusiasts who are committed 
              to helping each other succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Join Now
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
