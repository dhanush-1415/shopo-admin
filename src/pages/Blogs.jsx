import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Upload, AlignLeft, AlignCenter, AlignRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BlogEditor } from '@/components/blog/BlogEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

const mockBlogs = [
  {
    id: '1',
    title: 'Getting Started with E-commerce',
    slug: 'getting-started-with-ecommerce',
    shortDescription: 'Learn the basics of starting your online store and reaching customers worldwide.',
    content: '<h2>Introduction</h2><p>E-commerce has revolutionized the way we do business...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400',
    banner: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200',
    status: 'published',
    metaTitle: 'Getting Started with E-commerce | Your Store',
    metaDescription: 'Learn the basics of starting your online store and reaching customers worldwide.',
    author: 'Admin',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    thumbnailAlign: 'center',
    thumbnailSize: 100,
    bannerAlign: 'center',
    bannerSize: 100,
  },
  {
    id: '2',
    title: '10 Marketing Tips for Online Stores',
    slug: '10-marketing-tips-for-online-stores',
    shortDescription: 'Boost your sales with these proven marketing strategies for e-commerce businesses.',
    content: '<h2>Marketing Strategies</h2><p>Here are ten proven strategies...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    status: 'published',
    metaTitle: '10 Marketing Tips for Online Stores',
    metaDescription: 'Boost your sales with these proven marketing strategies for e-commerce businesses.',
    author: 'Admin',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
    thumbnailAlign: 'center',
    thumbnailSize: 100,
    bannerAlign: 'center',
    bannerSize: 100,
  },
  {
    id: '3',
    title: 'Future of Digital Payments',
    slug: 'future-of-digital-payments',
    shortDescription: 'Explore the latest trends in digital payment technologies and what they mean for businesses.',
    content: '<h2>Digital Payment Trends</h2><p>The payment landscape is evolving...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    banner: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
    status: 'draft',
    metaTitle: 'Future of Digital Payments',
    metaDescription: 'Explore the latest trends in digital payment technologies.',
    author: 'Admin',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-12',
    thumbnailAlign: 'center',
    thumbnailSize: 100,
    bannerAlign: 'center',
    bannerSize: 100,
  },
];

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState(mockBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    thumbnail: '',
    banner: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    thumbnailAlign: 'center',
    thumbnailSize: 100,
    bannerAlign: 'center',
    bannerSize: 100,
  });

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      content: '',
      thumbnail: '',
      banner: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      thumbnailAlign: 'center',
      thumbnailSize: 100,
      bannerAlign: 'center',
      bannerSize: 100,
    });
    setCurrentTab('basic');
    setIsCreateOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content,
      thumbnail: blog.thumbnail,
      banner: blog.banner,
      status: blog.status,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      thumbnailAlign: blog.thumbnailAlign || 'center',
      thumbnailSize: blog.thumbnailSize || 100,
      bannerAlign: blog.bannerAlign || 'center',
      bannerSize: blog.bannerSize || 100,
    });
    setCurrentTab('basic');
    setIsEditOpen(true);
  };

  const handlePreview = (blog) => {
    setSelectedBlog(blog);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  const handleSave = () => {
    if (selectedBlog) {
      setBlogs(
        blogs.map((blog) =>
          blog.id === selectedBlog.id
            ? {
                ...blog,
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : blog
        )
      );
      setIsEditOpen(false);
    } else {
      const newBlog = {
        id: String(blogs.length + 1),
        ...formData,
        author: 'Admin',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setBlogs([...blogs, newBlog]);
      setIsCreateOpen(false);
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: url });
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(field, file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getAlignmentClass = (align) => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  const renderImageUploader = (field, label) => {
    const isThumb = field === 'thumbnail';
    const align = isThumb ? formData.thumbnailAlign : formData.bannerAlign;
    const size = isThumb ? formData.thumbnailSize : formData.bannerSize;
    const image = formData[field];

    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold">{label} *</Label>
        
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, field)}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(field, e.target.files[0])}
            className="hidden"
            id={`${field}-upload`}
          />
          <label htmlFor={`${field}-upload`} className="cursor-pointer block">
            {image ? (
              <div className="space-y-3">
                <div className={`flex ${getAlignmentClass(align)} w-full`}>
                  <img
                    src={image}
                    alt={`${label} Preview`}
                    className="rounded-lg shadow-md"
                    style={{ 
                      width: `${size}%`,
                      maxHeight: '300px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Upload className="h-4 w-4" />
                  <p className="text-sm font-medium">Click or drag to replace image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Image Customization Options */}
        {image && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
            <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
              Image Display Options
            </h4>

            {/* Alignment */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Alignment</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={align === 'left' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFormData({ 
                    ...formData, 
                    [isThumb ? 'thumbnailAlign' : 'bannerAlign']: 'left' 
                  })}
                >
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Left
                </Button>
                <Button
                  type="button"
                  variant={align === 'center' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFormData({ 
                    ...formData, 
                    [isThumb ? 'thumbnailAlign' : 'bannerAlign']: 'center' 
                  })}
                >
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Center
                </Button>
                <Button
                  type="button"
                  variant={align === 'right' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFormData({ 
                    ...formData, 
                    [isThumb ? 'thumbnailAlign' : 'bannerAlign']: 'right' 
                  })}
                >
                  <AlignRight className="h-4 w-4 mr-2" />
                  Right
                </Button>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Image Width</Label>
                <span className="text-sm font-semibold text-blue-600">{size}%</span>
              </div>
              <Slider
                value={[size]}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  [isThumb ? 'thumbnailSize' : 'bannerSize']: value[0] 
                })}
                min={25}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Blog Information</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  let newFormData = { ...formData, title: newTitle };
                  if (!formData.slug) {
                    newFormData.slug = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  }
                  setFormData(newFormData);
                }}
                placeholder="Enter blog title"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog-url-slug"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary for listing and SEO"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-8">
          <h3 className="text-lg font-semibold text-gray-900">Images</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div>{renderImageUploader('thumbnail', 'Thumbnail Image')}</div>
            <div>{renderImageUploader('banner', 'Banner Image')}</div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="content" className="mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Label className="text-base font-semibold">Full Content *</Label>
          <div className="mt-4">
            <BlogEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="seo" className="space-y-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
          
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="text-sm font-medium">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO title (60 chars max)"
              maxLength={60}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              {formData.metaTitle.length}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-sm font-medium">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="SEO description (160 chars max)"
              rows={4}
              maxLength={160}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Blogs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Button className="gap-2 px-4 sm:px-6 h-10 sm:h-auto" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Create Blog
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 md:p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Blogs</p>
          <p className="text-lg md:text-2xl font-bold">{blogs.length}</p>
        </Card>
        <Card className="p-4 md:p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Published</p>
          <p className="text-lg md:text-2xl font-bold">
            {blogs.filter((b) => b.status === 'published').length}
          </p>
        </Card>
        <Card className="p-4 md:p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Drafts</p>
          <p className="text-lg md:text-2xl font-bold">
            {blogs.filter((b) => b.status === 'draft').length}
          </p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-auto"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10 sm:h-auto">Filter</Button>
            <Button variant="outline" size="sm" className="h-10 sm:h-auto">Export</Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left sm:text-center">Thumbnail</TableHead>
              <TableHead className="text-left sm:text-center">Title</TableHead>
              <TableHead className="text-left sm:text-center">Description</TableHead>
              <TableHead className="text-left sm:text-center">Status</TableHead>
              <TableHead className="text-left sm:text-center">Updated</TableHead>
              <TableHead className="text-left sm:text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id} className="hover:bg-muted/50">
                <TableCell className="text-left sm:text-center">
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-12 h-8 object-cover rounded mx-auto sm:mx-0"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium text-left sm:text-center">{blog.title}</TableCell>
                <TableCell className="max-w-xs truncate text-left sm:text-center">{blog.shortDescription}</TableCell>
                <TableCell className="text-left sm:text-center">
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-left sm:text-center">{blog.updatedAt}</TableCell>
                <TableCell className="text-left sm:text-center">
                  <div className="flex gap-1 sm:gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                        <DialogHeader className="p-6 border-b">
                          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Blog Preview - {blog.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto space-y-6">
                          {/* Blog Header */}
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                              <div className="flex-shrink-0 mb-4 md:mb-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                                  <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                <h2 className="text-xl md:text-2xl font-bold">{blog.title}</h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{blog.shortDescription}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs md:text-sm font-medium">Author:</span>
                                  <Badge variant="outline" className="text-xs md:text-sm">{blog.author}</Badge>
                                </div>
                                <Badge
                                  variant={blog.status === 'published' ? 'default' : 'secondary'}
                                  className="text-xs md:text-sm mt-2"
                                >
                                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </Card>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Upload className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Status</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold text-primary">{blog.status}</p>
                              <p className="text-xs text-muted-foreground">publication</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Created</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{blog.createdAt}</p>
                              <p className="text-xs text-muted-foreground">date</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <User className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Author</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{blog.author}</p>
                              <p className="text-xs text-muted-foreground">writer</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <AlignCenter className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Slug</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{blog.slug}</p>
                              <p className="text-xs text-muted-foreground">URL</p>
                            </Card>
                          </div>

                          {/* Blog Information */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <AlignLeft className="h-4 w-4" />
                                Basic Information
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Title</p>
                                  <p className="font-medium text-sm md:text-base">{blog.title}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Short Description</p>
                                  <p className="font-medium text-sm md:text-base leading-relaxed">{blog.shortDescription}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className="text-xs md:text-sm">
                                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                  </Badge>
                                </div>
                              </Card>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <AlignRight className="h-4 w-4" />
                                SEO Details
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Meta Title</p>
                                  <p className="font-medium text-sm md:text-base">{blog.metaTitle}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Meta Description</p>
                                  <p className="font-medium text-sm md:text-base">{blog.metaDescription}</p>
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Content Preview */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <AlignCenter className="h-4 w-4" />
                              Content Preview
                            </h3>
                            <Card className="p-4 md:p-6">
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                              />
                            </Card>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button variant="outline" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Blog
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                        <DialogHeader className="px-6 py-4 border-b">
                          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit Blog - {blog.title}
                          </DialogTitle>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">Update blog details to keep your content accurate.</p>
                        </DialogHeader>
                        <div className="p-6 space-y-6 overflow-y-auto">
                          {renderForm()}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90">
                              Save Changes
                            </Button>
                            <Button variant="outline" className="flex-1 h-10 sm:h-auto">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Blog
            </DialogTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Create a new blog post to engage your audience.</p>
          </DialogHeader>
          <div className="p-6 space-y-6 overflow-y-auto">
            {renderForm()}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90">
                Create Blog
              </Button>
              <Button variant="outline" className="flex-1 h-10 sm:h-auto">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}