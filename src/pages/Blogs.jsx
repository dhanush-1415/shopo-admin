import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Upload, AlignLeft, AlignCenter, AlignRight, Calendar, User, RefreshCw, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { getAllBlogs, getBlogById, createBlog, updateBlog } from '@/api/services/blogService';
import { useAuthStore } from '@/store/authStore';

/**
 * Transform API blog data to UI format
 */
const transformBlog = (apiBlog) => {
  // Format date from ISO string to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  // Map status: API uses "active" -> UI uses "published"
  const mapStatus = (status) => {
    if (status === 'active') return 'published';
    if (status === 'inactive') return 'draft';
    return status || 'draft';
  };

  // Handle image URLs - check if they're valid
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === 'undefined' || imageUrl.includes('/undefined')) {
      return null;
    }
    return imageUrl;
  };

  return {
    id: String(apiBlog.id),
    title: apiBlog.title || '',
    slug: apiBlog.slug || '',
    shortDescription: apiBlog.shortDescription || '',
    content: apiBlog.content || '',
    thumbnail: getImageUrl(apiBlog.featuredImage),
    banner: getImageUrl(apiBlog.bannerImage),
    status: mapStatus(apiBlog.status),
    metaTitle: apiBlog.metaTitle || '',
    metaDescription: apiBlog.metaDescription || '',
    author: 'Admin', // API doesn't provide author, using default
    createdAt: formatDate(apiBlog.createdAt),
    updatedAt: formatDate(apiBlog.updatedAt),
    thumbnailAlign: 'center', // Default values for UI-only fields
    thumbnailSize: 100,
    bannerAlign: 'center',
    bannerSize: 100,
  };
};

export default function Blogs() {
  const { getToken } = useAuthStore();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await getAllBlogs(token);

      if (response.success) {
        const transformedBlogs = (response.data || []).map(transformBlog);
        setBlogs(transformedBlogs);
      } else {
        setError(response.error || 'Failed to load blogs');
        toast.error(response.error || 'Failed to load blogs');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
    setFeaturedImageFile(null);
    setBannerImageFile(null);
    setSelectedBlog(null);
    setCurrentTab('basic');
    setIsCreateOpen(true);
  };

  const handleEdit = async (blog) => {
    setSelectedBlog(blog);
    setIsEditOpen(true);
    setIsLoadingBlog(true);
    try {
      const token = getToken();
      const response = await getBlogById(blog.id, token);

      if (response.success && response.data) {
        const apiBlog = response.data;
        // Map API status: "active" -> "published"
        const status = apiBlog.status === 'active' ? 'published' : (apiBlog.status === 'inactive' ? 'draft' : apiBlog.status);
        
        setFormData({
          title: apiBlog.title || '',
          slug: apiBlog.slug || '',
          shortDescription: apiBlog.shortDescription || '',
          content: apiBlog.content || '',
          thumbnail: apiBlog.featuredImage || '',
          banner: apiBlog.bannerImage || '',
          status: status,
          metaTitle: apiBlog.metaTitle || '',
          metaDescription: apiBlog.metaDescription || '',
          thumbnailAlign: 'center',
          thumbnailSize: 100,
          bannerAlign: 'center',
          bannerSize: 100,
        });
        setFeaturedImageFile(null);
        setBannerImageFile(null);
        setCurrentTab('basic');
      } else {
        toast.error(response.error || 'Failed to load blog details');
        setIsEditOpen(false);
        setSelectedBlog(null);
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred');
      setIsEditOpen(false);
      setSelectedBlog(null);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const handlePreview = async (blog) => {
    setSelectedBlog(blog);
    setIsPreviewOpen(true);
    setIsLoadingBlog(true);
    try {
      const token = getToken();
      const response = await getBlogById(blog.id, token);

      if (response.success && response.data) {
        const apiBlog = response.data;
        // Transform API blog to UI format
        const transformedBlog = transformBlog(apiBlog);
        setSelectedBlog(transformedBlog);
      } else {
        toast.error(response.error || 'Failed to load blog details');
        setIsPreviewOpen(false);
        setSelectedBlog(null);
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred');
      setIsPreviewOpen(false);
      setSelectedBlog(null);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  // Validation functions
  const isBasicInfoValid = () => {
    return formData.title && formData.slug && formData.shortDescription;
  };

  const isContentValid = () => {
    return formData.content && formData.content.trim().length > 0;
  };

  const isSEOValid = () => {
    return formData.metaTitle && formData.metaDescription;
  };

  const handleContinue = () => {
    if (currentTab === 'basic') {
      if (!isBasicInfoValid()) {
        toast.error('Please fill in all required fields in Basic Info');
        return;
      }
      setCurrentTab('content');
    } else if (currentTab === 'content') {
      if (!isContentValid()) {
        toast.error('Please fill in the content');
        return;
      }
      setCurrentTab('seo');
    }
  };

  const handleSave = async () => {
    // Validate all required fields
    if (!isBasicInfoValid()) {
      toast.error('Please fill in all required fields in Basic Info');
      setCurrentTab('basic');
      return;
    }
    if (!isContentValid()) {
      toast.error('Please fill in the content');
      setCurrentTab('content');
      return;
    }
    if (!isSEOValid()) {
      toast.error('Please fill in all SEO fields');
      setCurrentTab('seo');
      return;
    }

    setIsSaving(true);
    try {
      const token = getToken();
      const isEditMode = !!selectedBlog;
      
      // Prepare blog data for API
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        content: formData.content,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        featuredImage: featuredImageFile,
        bannerImage: bannerImageFile,
      };

      // Add id and status for update
      if (isEditMode) {
        blogData.id = selectedBlog.id;
        // Map UI status back to API status: "published" -> "active"
        blogData.status = formData.status === 'published' ? 'active' : (formData.status === 'draft' ? 'inactive' : formData.status);
      }

      const response = isEditMode 
        ? await updateBlog(blogData, token)
        : await createBlog(blogData, token);

      if (response.success) {
        toast.success(isEditMode ? 'Blog updated successfully' : 'Blog created successfully');
        
        if (isEditMode) {
          setIsEditOpen(false);
        } else {
          setIsCreateOpen(false);
        }
        
        // Reset form
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
        setFeaturedImageFile(null);
        setBannerImageFile(null);
        setSelectedBlog(null);
        setCurrentTab('basic');
        // Refresh blog list
        fetchBlogs();
      } else {
        toast.error(response.error || (isEditMode ? 'Failed to update blog' : 'Failed to create blog'));
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: url });
      
      // Store File object for API submission
      if (field === 'thumbnail') {
        setFeaturedImageFile(file);
      } else if (field === 'banner') {
        setBannerImageFile(file);
      }
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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-auto gap-2"
              onClick={fetchBlogs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-10 sm:h-auto">Filter</Button>
            <Button variant="outline" size="sm" className="h-10 sm:h-auto">Export</Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchBlogs} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
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
              {filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchQuery ? `No blogs found matching "${searchQuery}"` : 'No blogs found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                          onClick={() => handlePreview(blog)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog open={isPreviewOpen && selectedBlog?.id === blog.id} onOpenChange={(open) => {
                          if (!open) {
                            setIsPreviewOpen(false);
                            setSelectedBlog(null);
                          }
                        }}>
                          <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                            <DialogHeader className="p-6 border-b">
                              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Blog Preview {selectedBlog ? `- ${selectedBlog.title}` : ''}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="p-6 overflow-y-auto space-y-6">
                              {isLoadingBlog ? (
                                <div className="flex items-center justify-center py-12">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                              ) : selectedBlog ? (
                                <>
                              {/* Blog Header */}
                              <Card className="overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                                  <div className="flex-shrink-0 mb-4 md:mb-0">
                                    <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                                      <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <h2 className="text-xl md:text-2xl font-bold">{selectedBlog.title}</h2>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selectedBlog.shortDescription}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs md:text-sm font-medium">Author:</span>
                                      <Badge variant="outline" className="text-xs md:text-sm">{selectedBlog.author}</Badge>
                                    </div>
                                    <Badge
                                      variant={selectedBlog.status === 'published' ? 'default' : 'secondary'}
                                      className="text-xs md:text-sm mt-2"
                                    >
                                      {selectedBlog.status.charAt(0).toUpperCase() + selectedBlog.status.slice(1)}
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
                                  <p className="text-lg md:text-2xl font-bold text-primary">{selectedBlog.status}</p>
                                  <p className="text-xs text-muted-foreground">publication</p>
                                </Card>

                                <Card className="p-4 md:p-6 text-center">
                                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs md:text-sm">Created</span>
                                  </div>
                                  <p className="text-lg md:text-2xl font-bold">{selectedBlog.createdAt}</p>
                                  <p className="text-xs text-muted-foreground">date</p>
                                </Card>

                                <Card className="p-4 md:p-6 text-center">
                                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                    <User className="h-4 w-4" />
                                    <span className="text-xs md:text-sm">Author</span>
                                  </div>
                                  <p className="text-lg md:text-2xl font-bold">{selectedBlog.author}</p>
                                  <p className="text-xs text-muted-foreground">writer</p>
                                </Card>

                                <Card className="p-4 md:p-6 text-center">
                                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                    <AlignCenter className="h-4 w-4" />
                                    <span className="text-xs md:text-sm">Slug</span>
                                  </div>
                                  <p className="text-lg md:text-2xl font-bold">{selectedBlog.slug}</p>
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
                                      <p className="font-medium text-sm md:text-base">{selectedBlog.title}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                      <p className="text-xs md:text-sm text-muted-foreground">Short Description</p>
                                      <p className="font-medium text-sm md:text-base leading-relaxed">{selectedBlog.shortDescription}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                      <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                                      <Badge variant={selectedBlog.status === 'published' ? 'default' : 'secondary'} className="text-xs md:text-sm">
                                        {selectedBlog.status.charAt(0).toUpperCase() + selectedBlog.status.slice(1)}
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
                                      <p className="font-medium text-sm md:text-base">{selectedBlog.metaTitle}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                      <p className="text-xs md:text-sm text-muted-foreground">Meta Description</p>
                                      <p className="font-medium text-sm md:text-base">{selectedBlog.metaDescription}</p>
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
                                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
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
                                </>
                              ) : (
                                <div className="text-center text-muted-foreground py-12">
                                  No blog data available
                                </div>
                              )}
                            </div>
                        </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                          onClick={() => handleEdit(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={isEditOpen && selectedBlog?.id === blog.id} onOpenChange={(open) => {
                          if (!open) {
                            setIsEditOpen(false);
                            setSelectedBlog(null);
                          }
                        }}>
                          <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                            <DialogHeader className="px-6 py-4 border-b">
                              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Blog {formData.title ? `- ${formData.title}` : ''}
                              </DialogTitle>
                              <p className="text-xs md:text-sm text-muted-foreground mt-1">Update blog details to keep your content accurate.</p>
                            </DialogHeader>
                            <div className="p-6 space-y-6 overflow-y-auto">
                              {isLoadingBlog ? (
                                <div className="flex items-center justify-center py-12">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                              ) : (
                                <>
                                  {renderForm()}
                                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                    <Button 
                                      className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90"
                                      onClick={handleSave}
                                      disabled={isSaving || !isSEOValid()}
                                    >
                                      {isSaving ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        'Save Changes'
                                      )}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="flex-1 h-10 sm:h-auto"
                                      onClick={() => setIsEditOpen(false)}
                                      disabled={isSaving}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </>
                              )}
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
                ))
              )}
            </TableBody>
          </Table>
        )}
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
              {currentTab === 'seo' ? (
                <Button 
                  className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90"
                  onClick={handleSave}
                  disabled={isSaving || !isSEOValid()}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Blog'
                  )}
                </Button>
              ) : (
                <Button 
                  className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90"
                  onClick={handleContinue}
                  disabled={isSaving || (currentTab === 'basic' && !isBasicInfoValid()) || (currentTab === 'content' && !isContentValid())}
                >
                  Continue
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1 h-10 sm:h-auto"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCurrentTab('basic');
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}