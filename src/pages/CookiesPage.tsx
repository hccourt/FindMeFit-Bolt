import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const CookiesPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Cookie Policy
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. What Are Cookies?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. They help us 
                    provide you with a better experience by remembering your preferences, analyzing how you use our site, 
                    and enabling certain functionality.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    FindMeFit uses cookies for several purposes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>To remember your login status and preferences</li>
                    <li>To analyze website traffic and user behavior</li>
                    <li>To personalize content and recommendations</li>
                    <li>To ensure security and prevent fraud</li>
                    <li>To provide social media features</li>
                    <li>To deliver relevant advertisements</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Types of Cookies We Use</h2>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    <li>Authentication and login status</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                    <li>Accessibility features</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Performance Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    <li>Google Analytics for website usage statistics</li>
                    <li>Page load times and performance metrics</li>
                    <li>Error tracking and debugging</li>
                    <li>User journey analysis</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and settings.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    <li>Language and region preferences</li>
                    <li>Theme and display settings</li>
                    <li>Search filters and sorting preferences</li>
                    <li>Recently viewed content</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Marketing Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies are used to deliver advertisements that are relevant to you and your interests.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Targeted advertising based on interests</li>
                    <li>Social media integration and sharing</li>
                    <li>Conversion tracking for marketing campaigns</li>
                    <li>Retargeting and remarketing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may use third-party services that set their own cookies. These include:
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">Google Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use Google Analytics to analyze website usage and improve our services. Google Analytics 
                    uses cookies to collect information about how you use our website.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Payment Processors</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our payment partners may set cookies to process transactions securely and prevent fraud.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Social Media Platforms</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Social media plugins and sharing buttons may set cookies to enable functionality and track usage.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Managing Your Cookie Preferences</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have several options for managing cookies:
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Browser Settings</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set preferences for specific websites</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Cookie Consent Tool</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When you first visit our website, you'll see a cookie consent banner where you can choose 
                    which types of cookies to accept. You can change your preferences at any time using the 
                    cookie settings link in our footer.
                  </p>

                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <Button className="w-full sm:w-auto">
                      Manage Cookie Preferences
                    </Button>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">Opt-Out Links</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You can opt out of certain third-party cookies:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:text-primary/80">Google Analytics Opt-out</a></li>
                    <li><a href="https://www.youronlinechoices.com/" className="text-primary hover:text-primary/80">Your Online Choices</a></li>
                    <li><a href="https://optout.networkadvertising.org/" className="text-primary hover:text-primary/80">Network Advertising Initiative</a></li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Impact of Disabling Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    While you can disable cookies, doing so may affect your experience on our website:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>You may need to log in repeatedly</li>
                    <li>Your preferences and settings may not be saved</li>
                    <li>Some features may not work properly</li>
                    <li>Content may not be personalized to your interests</li>
                    <li>We may not be able to remember your cookie preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookie Retention</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Different cookies have different lifespans:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Persistent cookies:</strong> Remain until they expire or you delete them</li>
                    <li><strong>Essential cookies:</strong> Typically last for the duration of your session</li>
                    <li><strong>Analytics cookies:</strong> Usually expire after 2 years</li>
                    <li><strong>Marketing cookies:</strong> May last from 30 days to 2 years</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Updates to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or 
                    applicable laws. We will notify you of any material changes by posting the updated policy 
                    on our website and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions about our use of cookies, please contact us:
                  </p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-medium">FindMeFit Support</p>
                    <p className="text-muted-foreground">Email: privacy@findme.fit</p>
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
