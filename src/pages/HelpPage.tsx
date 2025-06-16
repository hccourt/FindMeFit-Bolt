import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail, Phone } from 'lucide-react';

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account on FindMeFit?",
        answer: "Creating an account is simple! Click the 'Sign Up' button in the top navigation, choose whether you're a client or instructor, fill in your details, and verify your email address. You'll be ready to start using the platform immediately."
      },
      {
        question: "What's the difference between client and instructor accounts?",
        answer: "Client accounts allow you to browse and book fitness classes and personal training sessions. Instructor accounts let you create and manage your own classes, set your rates, and connect with clients. You can always upgrade from a client to an instructor account later."
      },
      {
        question: "Is FindMeFit free to use?",
        answer: "Yes! Creating an account and browsing classes is completely free. Clients only pay for the sessions they book, and instructors pay a small commission on completed bookings. There are no monthly fees or hidden charges."
      }
    ]
  },
  {
    category: "Booking Classes",
    questions: [
      {
        question: "How do I book a fitness class?",
        answer: "Browse classes on our Discover page, click on any class that interests you, review the details, and click 'Book Now'. You'll need to be logged in to complete your booking. Payment is typically handled at the venue."
      },
      {
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel bookings through your dashboard. Cancellation policies vary by instructor, but most allow free cancellation up to 24 hours before the session. Check the specific class details for the cancellation policy."
      },
      {
        question: "What if a class is full?",
        answer: "If a class shows as 'Full', you can contact the instructor directly to see if they have a waiting list or if additional spots might become available due to cancellations."
      }
    ]
  },
  {
    category: "For Instructors",
    questions: [
      {
        question: "How do I become a verified instructor?",
        answer: "After creating an instructor account, upload your certifications and qualifications. Our team reviews all instructor applications to ensure quality and safety standards. Verification typically takes 2-3 business days."
      },
      {
        question: "How do I set my rates?",
        answer: "When creating a class, you can set your own pricing. Consider factors like session length, group size, location, and your experience level. You can always adjust rates for future classes."
      },
      {
        question: "How do I get paid?",
        answer: "Most payments are handled directly between you and your clients at the venue. For online payments, we process payments weekly and transfer funds to your registered bank account minus our small commission fee."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I'm having trouble logging in",
        answer: "First, check that you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' link on the login page. If you're still having issues, contact our support team."
      },
      {
        question: "The website isn't working properly",
        answer: "Try refreshing the page or clearing your browser cache. Make sure you're using an up-to-date browser. If problems persist, contact our technical support team with details about your browser and the issue you're experiencing."
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to your Dashboard and click 'Profile Settings' or visit the profile page directly. You can update your personal information, profile photo, bio, and other details. Changes are saved automatically."
      }
    ]
  }
];

export const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Find answers to common questions or get in touch with our support team. 
              We're here to help you make the most of FindMeFit.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <Input
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
                className="text-center"
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get instant help from our support team
              </p>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Send us a detailed message about your issue
              </p>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone Support</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Speak directly with our support team
              </p>
              <Button variant="outline" className="w-full">
                01865 842 156
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          {filteredFAQ.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQ.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => {
                      const itemId = `${category.category}-${index}`;
                      const isOpen = openItems.includes(itemId);
                      
                      return (
                        <Card key={itemId}>
                          <CardContent className="p-0">
                            <button
                              onClick={() => toggleItem(itemId)}
                              className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                              <span className="font-medium text-foreground pr-4">
                                {faq.question}
                              </span>
                              {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-6">
                                <p className="text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No results found for "{searchTerm}". Try a different search term or browse our categories above.
              </p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our friendly support team is here to help. 
                Get in touch and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@findme.fit"
                  className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Email Support
                </a>
                <a
                  href="tel:01865842156"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
                >
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
