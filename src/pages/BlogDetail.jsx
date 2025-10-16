import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const mockBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with E-commerce',
    slug: 'getting-started-with-ecommerce',
    shortDescription: 'Learn the basics of starting your online store and reaching customers worldwide.',
    content: `
      <h2>Introduction to E-commerce</h2>
      <p>E-commerce has revolutionized the way we do business. In today's digital age, having an online presence is not just an option—it's a necessity. Whether you're a small business owner or a large enterprise, understanding the fundamentals of e-commerce can help you reach a global audience and grow your revenue.</p>
      
      <h3>Why Start an Online Store?</h3>
      <p>There are numerous benefits to starting an online store:</p>
      <ul>
        <li><strong>Global Reach:</strong> Sell to customers anywhere in the world</li>
        <li><strong>Lower Overhead:</strong> Reduced costs compared to physical stores</li>
        <li><strong>24/7 Availability:</strong> Your store never closes</li>
        <li><strong>Data-Driven Insights:</strong> Track and analyze customer behavior</li>
      </ul>
      
      <h3>Essential Components</h3>
      <p>To succeed in e-commerce, you need to focus on these key areas:</p>
      <ol>
        <li><strong>User-Friendly Website:</strong> A clean, intuitive design is crucial</li>
        <li><strong>Secure Payment Processing:</strong> Build trust with secure checkout</li>
        <li><strong>Inventory Management:</strong> Keep track of your products efficiently</li>
        <li><strong>Marketing Strategy:</strong> Attract and retain customers</li>
      </ol>
      
      <h3>Getting Started</h3>
      <p>Starting your e-commerce journey doesn't have to be overwhelming. Begin with these steps:</p>
      <p>First, identify your niche and target audience. Understanding who you're selling to will inform every decision you make. Next, choose the right platform for your needs—whether that's a custom solution or an established platform like Shopify or WooCommerce.</p>
      
      <blockquote>
        <p>"The best time to start was yesterday. The next best time is now."</p>
      </blockquote>
      
      <p>Finally, focus on providing excellent customer service. In the digital world, customer reviews and word-of-mouth can make or break your business. Respond promptly to inquiries, handle returns professionally, and always strive to exceed expectations.</p>
      
      <h3>Conclusion</h3>
      <p>E-commerce offers incredible opportunities for businesses of all sizes. With the right strategy and tools, you can build a successful online store that serves customers around the world. Start small, learn continuously, and scale as you grow.</p>
    `,
    banner: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200',
    author: 'Admin',
    publishedAt: '2024-01-15',
    category: 'E-commerce',
  },
  {
    id: '2',
    title: '10 Marketing Tips for Online Stores',
    slug: '10-marketing-tips-for-online-stores',
    shortDescription: 'Boost your sales with these proven marketing strategies for e-commerce businesses.',
    content: `
      <h2>Marketing Strategies That Work</h2>
      <p>Marketing is the lifeblood of any successful online store. Here are ten proven strategies to boost your sales and grow your business.</p>
      
      <h3>1. Email Marketing</h3>
      <p>Build an email list and nurture your subscribers with valuable content and exclusive offers.</p>
      
      <h3>2. Social Media Marketing</h3>
      <p>Engage with your audience on platforms where they spend their time.</p>
      
      <h3>3. Content Marketing</h3>
      <p>Create valuable content that attracts and educates your target audience.</p>
      
      <p>Continue implementing these strategies consistently for the best results.</p>
    `,
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    author: 'Admin',
    publishedAt: '2024-02-01',
    category: 'Marketing',
  },
];

export default function BlogDetail() {
  const { slug } = useParams();
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={post.banner}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 -mt-32 relative z-10">
        <Card>
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              <Badge className="mb-4">{post.category}</Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {post.shortDescription}
              </p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground pb-6 border-b">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:italic prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Related Posts */}
        <div className="mt-16 mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {mockBlogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <img
                      src={relatedPost.banner}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge className="mb-2">{relatedPost.category}</Badge>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {relatedPost.shortDescription}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}