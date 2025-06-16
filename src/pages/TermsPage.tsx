import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';

export const TermsPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Last updated: January 15, 2024
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 prose prose-gray max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using FindMeFit ("the Service"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    FindMeFit is a platform that connects fitness instructors with clients seeking fitness services. 
                    The Service includes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>A marketplace for fitness instructors to offer their services</li>
                    <li>A booking system for clients to schedule fitness sessions</li>
                    <li>Communication tools between instructors and clients</li>
                    <li>Payment processing for fitness services</li>
                    <li>Review and rating systems</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To use certain features of the Service, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Instructor Responsibilities</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you register as an instructor, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Maintain current and valid certifications and qualifications</li>
                    <li>Provide accurate information about your services and availability</li>
                    <li>Conduct yourself professionally with all clients</li>
                    <li>Maintain appropriate insurance coverage</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Honor all confirmed bookings or provide reasonable notice of cancellation</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Client Responsibilities</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you book services as a client, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide accurate health and fitness information when requested</li>
                    <li>Follow instructor guidelines and safety instructions</li>
                    <li>Arrive on time for scheduled sessions</li>
                    <li>Provide reasonable notice for cancellations</li>
                    <li>Pay for services as agreed</li>
                    <li>Treat instructors with respect and professionalism</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Payments and Fees</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Payment terms and conditions:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Clients are responsible for paying instructors for booked services</li>
                    <li>FindMeFit may charge a service fee for platform usage</li>
                    <li>Payment methods and timing are specified at the time of booking</li>
                    <li>Refund policies are determined by individual instructors</li>
                    <li>All fees are non-refundable unless otherwise specified</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cancellation Policy</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Cancellation policies may vary by instructor but generally include:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>24-hour notice required for free cancellation</li>
                    <li>Late cancellations may incur fees</li>
                    <li>No-shows may be charged the full session fee</li>
                    <li>Instructors may cancel due to illness or emergency</li>
                    <li>Weather-related cancellations follow instructor policies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Safety and Liability</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Important safety considerations:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Clients participate in fitness activities at their own risk</li>
                    <li>Consult healthcare providers before beginning any fitness program</li>
                    <li>Inform instructors of any health conditions or limitations</li>
                    <li>Follow all safety guidelines provided by instructors</li>
                    <li>FindMeFit is not liable for injuries during fitness sessions</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Prohibited Uses</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You may not use the Service to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Post false, misleading, or fraudulent information</li>
                    <li>Circumvent platform fees or payment systems</li>
                    <li>Use the platform for any illegal activities</li>
                    <li>Interfere with the operation of the Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                    of the Service, to understand our practices regarding the collection and use of your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Modifications to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    FindMeFit reserves the right to modify these terms at any time. We will notify users of significant 
                    changes via email or platform notification. Continued use of the Service after changes constitutes 
                    acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Either party may terminate their account at any time. FindMeFit reserves the right to suspend or 
                    terminate accounts that violate these terms. Upon termination, your right to use the Service ceases immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-medium">FindMeFit Support</p>
                    <p className="text-muted-foreground">Email: legal@findme.fit</p>
                    <p className="text-muted-foreground">Phone: 01865 842 156</p>
                    <p className="text-muted-foreground">Address: 45 High Street, Kidlington, Oxfordshire OX5 2DH</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
