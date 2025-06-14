import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';

export const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Privacy Policy
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    FindMeFit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                    explains how we collect, use, disclose, and safeguard your information when you use our platform 
                    and services. Please read this privacy policy carefully.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect personal information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and photos</li>
                    <li>Payment and billing information</li>
                    <li>Health and fitness information (when voluntarily provided)</li>
                    <li>Communication preferences</li>
                    <li>Reviews and ratings</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Usage Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We automatically collect certain information about your use of our services:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage patterns and preferences</li>
                    <li>Location data (when permitted)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Providing and maintaining our services</li>
                    <li>Processing bookings and payments</li>
                    <li>Communicating with you about your account and services</li>
                    <li>Personalizing your experience</li>
                    <li>Improving our platform and services</li>
                    <li>Ensuring safety and security</li>
                    <li>Complying with legal obligations</li>
                    <li>Marketing and promotional communications (with your consent)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">With Other Users</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Profile information with instructors when you book services</li>
                    <li>Contact information to facilitate communication</li>
                    <li>Reviews and ratings you provide</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">With Service Providers</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Payment processors for transaction handling</li>
                    <li>Technology providers for platform functionality</li>
                    <li>Customer support services</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Legal Requirements</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>When required by law or legal process</li>
                    <li>To protect our rights and safety</li>
                    <li>To prevent fraud or illegal activities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection</li>
                    <li>Incident response procedures</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights and Choices</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong>Access:</strong> Request access to your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Restriction:</strong> Request limitation of processing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies and Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    You can control cookie settings through your browser preferences. However, disabling cookies 
                    may affect the functionality of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services and fulfill 
                    the purposes outlined in this policy. We may retain certain information for longer periods when 
                    required by law or for legitimate business purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. International Data Transfers</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure 
                    appropriate safeguards are in place to protect your information in accordance with applicable 
                    data protection laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not intended for children under 16 years of age. We do not knowingly collect 
                    personal information from children under 16. If we become aware that we have collected such 
                    information, we will take steps to delete it promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes 
                    by posting the new policy on our platform and updating the "Last updated" date. Your continued 
                    use of our services after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-medium">Data Protection Officer</p>
                    <p className="text-muted-foreground">Email: privacy@findmefit.com</p>
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