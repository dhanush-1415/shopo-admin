import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with E-commerce',
    slug: 'getting-started-with-ecommerce',
    shortDescription: 'Learn the basics of starting your online store and reaching customers worldwide.',
    thumbnail: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
    author: 'Admin',
    publishedAt: '2024-01-15',
    category: 'E-commerce',
  },
  {
    id: '2',
    title: '10 Marketing Tips for Online Stores',
    slug: '10-marketing-tips-for-online-stores',
    shortDescription: 'Boost your sales with these proven marketing strategies for e-commerce businesses.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    author: 'Admin',
    publishedAt: '2024-02-01',
    category: 'Marketing',
  },
  {
    id: '3',
    title: 'Customer Service Excellence',
    slug: 'customer-service-excellence',
    shortDescription: 'How to provide exceptional customer service that keeps shoppers coming back.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    author: 'Admin',
    publishedAt: '2024-02-10',
    category: 'Business',
  },
  {
    id: '4',
    title: 'Inventory Management Best Practices',
    slug: 'inventory-management-best-practices',
    shortDescription: 'Optimize your inventory management to reduce costs and improve efficiency.',
    thumbnail: 'https://images.unsplash.com/photo-1553531087-9d35f3e4d11f?w=800',
    author: 'Admin',
    publishedAt: '2024-02-15',
    category: 'Operations',
  },
  {
    id: '5',
    title: 'Social Media Strategies for 2024',
    slug: 'social-media-strategies-2024',
    shortDescription: 'Discover the latest social media trends and how to leverage them for your store.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    author: 'Admin',
    publishedAt: '2024-02-20',
    category: 'Marketing',
  },
  {
    id: '6',
    title: 'SEO Tips for E-commerce Websites',
    slug: 'seo-tips-for-ecommerce',
    shortDescription: 'Improve your search engine rankings and drive more organic traffic to your store.',
    thumbnail: 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=800',
    author: 'Admin',
    publishedAt: '2024-02-25',
    category: 'SEO',
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockBlogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Insights, tips, and updates from our team
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3">{post.category}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No blog posts found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}