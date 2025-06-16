import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Download, ExternalLink, Calendar } from 'lucide-react';

const pressReleases = [
  {
    id: 1,
    title: "FindMeFit Launches Revolutionary Fitness Platform Connecting Instructors and Clients",
    date: "2024-01-15",
    excerpt: "New platform makes it easier than ever for fitness enthusiasts to find qualified instructors and book sessions in their local area.",
    type: "Press Release",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "FindMeFit Expands to Serve Oxfordshire Communities",
    date: "2024-01-10",
    excerpt: "Local fitness platform now serving Kidlington, Oxford, and surrounding areas with verified instructors and flexible booking options.",
    type: "Company News",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "FindMeFit Partners with Local Gyms to Expand Service Offerings",
    date: "2024-01-05",
    excerpt: "Strategic partnerships enable platform users to access premium facilities and specialized equipment for their fitness sessions.",
    type: "Partnership",
    downloadUrl: "#"
  }
];

const mediaKit = [
  {
    name: "FindMeFit Logo Package",
    description: "High-resolution logos in various formats (PNG, SVG, EPS)",
    size: "2.4 MB",
    downloadUrl: "#"
  },
  {
    name: "Company Fact Sheet",
    description: "Key statistics, company overview, and leadership information",
    size: "156 KB",
    downloadUrl: "#"
  },
  {
    name: "Product Screenshots",
    description: "High-quality screenshots of the platform interface",
    size: "8.7 MB",
    downloadUrl: "#"
  },
  {
    name: "Executive Headshots",
    description: "Professional photos of company leadership team",
    size: "3.2 MB",
    downloadUrl: "#"
  }
];

const mediaContacts = [
  {
    name: "Sarah Thompson",
    title: "Head of Operations & Media Relations",
    email: "press@findme.fit",
    phone: "01865 842 156"
  }
];

export const PressPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Latest news, press releases, and media resources for journalists 
              and media professionals covering FindMeFit.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <Card key={release.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline">{release.type}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(release.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {release.excerpt}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
                        <ExternalLink className="h-4 w-4" />
                        <span>View Online</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Media Kit</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Download our media kit for high-resolution logos, product images, 
            company information, and other resources for your coverage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        File size: {item.size}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors ml-4">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Media Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-primary text-sm mb-4">{contact.title}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Company Information</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">About FindMeFit</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    FindMeFit is a leading fitness platform that connects certified instructors 
                    with clients seeking personalized fitness experiences. Based in Oxfordshire, 
                    we serve communities across the UK with our innovative booking platform.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Founded in 2024, FindMeFit has quickly become the go-to platform for 
                    fitness enthusiasts looking for quality instruction and flexible scheduling.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Founded:</span>
                      <span className="text-foreground font-medium">2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Headquarters:</span>
                      <span className="text-foreground font-medium">Kidlington, Oxfordshire</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="text-foreground font-medium">Health & Fitness Technology</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Website:</span>
                      <span className="text-foreground font-medium">findme.fit</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
