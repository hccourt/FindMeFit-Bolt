import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Tips for Starting Your Fitness Journey",
    excerpt: "Beginning a fitness routine can feel overwhelming. Here are five practical tips to help you start strong and stay motivated on your wellness journey.",
    author: "Sarah Thompson",
    authorImage: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Beginner Tips",
    image: "https://images.pexels.com/photos/4498604/pexels-photo-4498604.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true
  },
  {
    id: 2,
    title: "The Benefits of Group Fitness Classes",
    excerpt: "Discover why group fitness classes might be the perfect solution for staying motivated and achieving your health goals.",
    author: "James Mitchell",
    authorImage: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-12",
    readTime: "4 min read",
    category: "Group Fitness",
    image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    title: "Personal Training vs Group Classes: Which is Right for You?",
    excerpt: "Explore the pros and cons of personal training and group classes to help you make the best choice for your fitness goals.",
    author: "David Chen",
    authorImage: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Training Tips",
    image: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    title: "Building Healthy Habits That Last",
    excerpt: "Learn how to create sustainable fitness habits that will serve you for years to come, backed by behavioral science.",
    author: "Sarah Thompson",
    authorImage: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Lifestyle",
    image: "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    title: "Nutrition Basics for Fitness Enthusiasts",
    excerpt: "Understanding the fundamentals of nutrition can significantly enhance your fitness results. Here's what you need to know.",
    author: "James Mitchell",
    authorImage: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-05",
    readTime: "8 min read",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    title: "How to Choose the Right Fitness Instructor",
    excerpt: "Finding the right fitness instructor can make all the difference in your journey. Here's what to look for.",
    author: "David Chen",
    authorImage: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2024-01-03",
    readTime: "5 min read",
    category: "Instructor Tips",
    image: "https://images.pexels.com/photos/4498318/pexels-photo-4498318.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export const BlogPage: React.FC = () => {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              FindMeFit Blog
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert insights, tips, and inspiration for your fitness journey. 
              Stay informed with the latest trends and advice from our community of professionals.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="primary">Featured</Badge>
              <span className="text-muted-foreground text-sm">Latest Article</span>
            </div>
            
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={featuredPost.authorImage}
                        name={featuredPost.author}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{featuredPost.author}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={post.authorImage}
                        name={post.author}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground">{post.author}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest fitness tips, instructor spotlights, 
                and platform updates delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};