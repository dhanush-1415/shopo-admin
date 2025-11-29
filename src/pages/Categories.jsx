
import React, { useState, useEffect } from "react";
import { Plus, FolderTree, Edit, Trash2, ChevronRight, ChevronDown, Upload, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { toast } from "sonner";
import { createCategory, createSubcategory, createChildCategory, getAllCategories, updateCategory, updateSubcategory, updateChildCategory, getCategoryById, getSubcategoryById, getChildCategoryById } from "@/api/services/categoryService";
import { useAuthStore } from "@/store/authStore";

// Transform API response to match component structure
const transformCategories = (apiCategories) => {
  if (!Array.isArray(apiCategories)) return [];
  
  const API_BASE_URL = 'http://luxcycs.com:5501';
  
  return apiCategories.map(cat => {
    // Handle image URL - prepend base URL if it's a relative path
    let imageUrl = cat.image || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL}/${imageUrl}`;
    }
    
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.name?.toLowerCase().replace(/\s+/g, '-') || '',
      description: cat.description || '',
      image: imageUrl,
      productCount: 0, // TODO: Calculate from products if available
      subcategories: (cat.ProductSubCategories || []).map(sub => ({
        id: sub.id,
        name: sub.name,
        categoryId: sub.categoryId,
        productCount: 0, // TODO: Calculate from products if available
        childSubcategories: (sub.ProductChildCategories || []).map(child => ({
          id: child.id,
          name: child.name,
          description: child.description,
          subCategoryId: child.subCategoryId,
          status: child.status,
          productCount: 0, // TODO: Calculate from products if available
        })),
      })),
    };
  });
};

export default function Categories() {
  const { getToken } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateSubcategoryOpen, setIsCreateSubcategoryOpen] = useState(false);
  const [isCreateChildSubcategoryOpen, setIsCreateChildSubcategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const [isEditChildCategoryOpen, setIsEditChildCategoryOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: null,
    imagePreview: null,
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    categoryId: '',
  });
  const [childCategoryForm, setChildCategoryForm] = useState({
    name: '',
    subCategoryId: '',
  });

  // Loading states
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);
  const [isCreatingChildCategory, setIsCreatingChildCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isUpdatingSubcategory, setIsUpdatingSubcategory] = useState(false);
  const [isUpdatingChildCategory, setIsUpdatingChildCategory] = useState(false);
  const [isLoadingCategoryDetails, setIsLoadingCategoryDetails] = useState(false);
  const [isLoadingSubcategoryDetails, setIsLoadingSubcategoryDetails] = useState(false);
  const [isLoadingChildCategoryDetails, setIsLoadingChildCategoryDetails] = useState(false);

  // Edit form states
  const [editCategoryForm, setEditCategoryForm] = useState({
    id: null,
    name: '',
    image: null,
    imagePreview: null,
  });
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({
    id: null,
    name: '',
    categoryId: '',
  });
  const [editChildCategoryForm, setEditChildCategoryForm] = useState({
    id: null,
    name: '',
    subCategoryId: '',
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await getAllCategories(token);
      
      if (response.success) {
        const transformed = transformCategories(response.data);
        setCategories(transformed);
      } else {
        setError(response.error || 'Failed to load categories');
        toast.error(response.error || 'Failed to load categories');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flatten subcategories for select options
  const allSubcategories = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      id: sub.id,
      name: `${cat.name} > ${sub.name}`,
      slug: sub.slug || `${cat.name.toLowerCase().replace(/\s+/g, '-')}-${sub.name.toLowerCase().replace(/\s+/g, '-')}`,
    }))
  );

  // Helper to calculate total child subcategories
  const totalChildSubcategories = categories.reduce((sum, cat) => {
    return sum + cat.subcategories.reduce((childSum, sub) => childSum + (sub.childSubcategories?.length || 0), 0);
  }, 0);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 1:
        return <FolderTree className="h-4 w-4 text-primary" />;
      case 2:
        return <ChevronRight className="h-4 w-4 text-muted-foreground" />;
      case 3:
        return <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />;
      default:
        return null;
    }
  };

  // Handle category image upload
  const handleCategoryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setCategoryForm(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  // Handle create category
  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('Please enter category name');
      return;
    }
    if (!categoryForm.image) {
      toast.error('Please upload a category image');
      return;
    }

    setIsCreatingCategory(true);
    try {
      const token = getToken();
      const response = await createCategory(
        {
          name: categoryForm.name.trim(),
          image: categoryForm.image,
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Category created successfully!');
        setIsCreateCategoryOpen(false);
        setCategoryForm({ name: '', image: null, imagePreview: null });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to create category');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Handle create subcategory
  const handleCreateSubcategory = async () => {
    if (!subcategoryForm.name.trim()) {
      toast.error('Please enter subcategory name');
      return;
    }
    if (!subcategoryForm.categoryId) {
      toast.error('Please select a parent category');
      return;
    }

    setIsCreatingSubcategory(true);
    try {
      const token = getToken();
      const response = await createSubcategory(
        {
          name: subcategoryForm.name.trim(),
          categoryId: parseInt(subcategoryForm.categoryId),
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Subcategory created successfully!');
        setIsCreateSubcategoryOpen(false);
        setSubcategoryForm({ name: '', categoryId: '' });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to create subcategory');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsCreatingSubcategory(false);
    }
  };

  // Handle create child category
  const handleCreateChildCategory = async () => {
    if (!childCategoryForm.name.trim()) {
      toast.error('Please enter child category name');
      return;
    }
    if (!childCategoryForm.subCategoryId) {
      toast.error('Please select a parent subcategory');
      return;
    }

    setIsCreatingChildCategory(true);
    try {
      const token = getToken();
      const response = await createChildCategory(
        {
          name: childCategoryForm.name.trim(),
          subCategoryId: parseInt(childCategoryForm.subCategoryId),
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Child category created successfully!');
        setIsCreateChildSubcategoryOpen(false);
        setChildCategoryForm({ name: '', subCategoryId: '' });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to create child category');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsCreatingChildCategory(false);
    }
  };

  // Handle edit category image upload
  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setEditCategoryForm(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  // Handle open edit category
  const handleOpenEditCategory = async (category) => {
    setIsEditCategoryOpen(true);
    setIsLoadingCategoryDetails(true);
    
    try {
      const token = getToken();
      const response = await getCategoryById(category.id, token);
      
      if (response.success && response.data) {
        const categoryData = response.data;
        // Handle image URL - prepend base URL if it's a relative path
        let imageUrl = categoryData.image || '';
        const API_BASE_URL = 'http://luxcycs.com:5501';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${API_BASE_URL}/${imageUrl}`;
        }
        
        setEditCategoryForm({
          id: categoryData.id,
          name: categoryData.name || '',
          image: null,
          imagePreview: imageUrl || null,
        });
      } else {
        toast.error(response.error || 'Failed to load category details');
        // Fallback to local data
        setEditCategoryForm({
          id: category.id,
          name: category.name,
          image: null,
          imagePreview: category.image || null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch category details:', error);
      toast.error('Failed to load category details');
      // Fallback to local data
      setEditCategoryForm({
        id: category.id,
        name: category.name,
        image: null,
        imagePreview: category.image || null,
      });
    } finally {
      setIsLoadingCategoryDetails(false);
    }
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    if (!editCategoryForm.name.trim()) {
      toast.error('Please enter category name');
      return;
    }

    setIsUpdatingCategory(true);
    try {
      const token = getToken();
      const response = await updateCategory(
        {
          id: editCategoryForm.id,
          name: editCategoryForm.name.trim(),
          image: editCategoryForm.image,
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Category updated successfully!');
        setIsEditCategoryOpen(false);
        setEditCategoryForm({ id: null, name: '', image: null, imagePreview: null });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to update category');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  // Handle open edit subcategory
  const handleOpenEditSubcategory = async (subcategory, parentCategory) => {
    setIsEditSubcategoryOpen(true);
    setIsLoadingSubcategoryDetails(true);
    
    try {
      const token = getToken();
      const response = await getSubcategoryById(subcategory.id, token);
      
      if (response.success && response.data) {
        const subcategoryData = response.data;
        setEditSubcategoryForm({
          id: subcategoryData.id,
          name: subcategoryData.name || '',
          categoryId: subcategoryData.categoryId?.toString() || parentCategory?.id?.toString() || '',
        });
      } else {
        toast.error(response.error || 'Failed to load subcategory details');
        // Fallback to local data
        setEditSubcategoryForm({
          id: subcategory.id,
          name: subcategory.name,
          categoryId: subcategory.categoryId?.toString() || parentCategory?.id?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch subcategory details:', error);
      toast.error('Failed to load subcategory details');
      // Fallback to local data
      setEditSubcategoryForm({
        id: subcategory.id,
        name: subcategory.name,
        categoryId: subcategory.categoryId?.toString() || parentCategory?.id?.toString() || '',
      });
    } finally {
      setIsLoadingSubcategoryDetails(false);
    }
  };

  // Handle update subcategory
  const handleUpdateSubcategory = async () => {
    if (!editSubcategoryForm.name.trim()) {
      toast.error('Please enter subcategory name');
      return;
    }
    if (!editSubcategoryForm.categoryId) {
      toast.error('Please select a parent category');
      return;
    }

    setIsUpdatingSubcategory(true);
    try {
      const token = getToken();
      const response = await updateSubcategory(
        {
          id: editSubcategoryForm.id,
          name: editSubcategoryForm.name.trim(),
          categoryId: parseInt(editSubcategoryForm.categoryId),
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Subcategory updated successfully!');
        setIsEditSubcategoryOpen(false);
        setEditSubcategoryForm({ id: null, name: '', categoryId: '' });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to update subcategory');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdatingSubcategory(false);
    }
  };

  // Handle open edit child category
  const handleOpenEditChildCategory = async (childCategory, parentSubcategory) => {
    setIsEditChildCategoryOpen(true);
    setIsLoadingChildCategoryDetails(true);
    
    try {
      const token = getToken();
      const response = await getChildCategoryById(childCategory.id, token);
      
      if (response.success && response.data) {
        const childCategoryData = response.data;
        setEditChildCategoryForm({
          id: childCategoryData.id,
          name: childCategoryData.name || '',
          subCategoryId: childCategoryData.subCategoryId?.toString() || parentSubcategory?.id?.toString() || '',
        });
      } else {
        toast.error(response.error || 'Failed to load child category details');
        // Fallback to local data
        setEditChildCategoryForm({
          id: childCategory.id,
          name: childCategory.name,
          subCategoryId: childCategory.subCategoryId?.toString() || parentSubcategory?.id?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch child category details:', error);
      toast.error('Failed to load child category details');
      // Fallback to local data
      setEditChildCategoryForm({
        id: childCategory.id,
        name: childCategory.name,
        subCategoryId: childCategory.subCategoryId?.toString() || parentSubcategory?.id?.toString() || '',
      });
    } finally {
      setIsLoadingChildCategoryDetails(false);
    }
  };

  // Handle update child category
  const handleUpdateChildCategory = async () => {
    if (!editChildCategoryForm.name.trim()) {
      toast.error('Please enter child category name');
      return;
    }
    if (!editChildCategoryForm.subCategoryId) {
      toast.error('Please select a parent subcategory');
      return;
    }

    setIsUpdatingChildCategory(true);
    try {
      const token = getToken();
      const response = await updateChildCategory(
        {
          id: editChildCategoryForm.id,
          name: editChildCategoryForm.name.trim(),
          subCategoryId: parseInt(editChildCategoryForm.subCategoryId),
        },
        token
      );

      if (response.success) {
        toast.success(response.data?.message || 'Child category updated successfully!');
        setIsEditChildCategoryOpen(false);
        setEditChildCategoryForm({ id: null, name: '', subCategoryId: '' });
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.error || 'Failed to update child category');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdatingChildCategory(false);
    }
  };

  const renderCategoryRow = (category, level = 1) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.subcategories && category.subcategories.length > 0;

    return (
      <React.Fragment key={`cat-${category.id}`}>
        <TableRow className="hover:bg-muted/50">
          <TableCell className="font-medium">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${(level - 1) * 24}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              {getLevelIcon(level)}
              <span className="font-semibold">{category.name}</span>
              {level === 1 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Level {level}
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground text-sm">
            {level === 1 ? category.description : '-'}
          </TableCell>
          <TableCell className="text-center">
            <Badge variant="outline">{category.productCount}</Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleOpenEditCategory(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && category.subcategories?.map((subcategory) => renderSubcategoryRow(subcategory, category, level + 1))}
      </React.Fragment>
    );
  };

  const renderSubcategoryRow = (subcategory, parentCategory, level = 2) => {
    const isExpanded = expandedSubcategories.has(subcategory.id);
    const hasChildren = subcategory.childSubcategories && subcategory.childSubcategories.length > 0;

    return (
      <React.Fragment key={`sub-${subcategory.id}`}>
        <TableRow className="hover:bg-muted/30">
          <TableCell>
            <div className="flex items-center gap-2" style={{ paddingLeft: `${(level - 1) * 24}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleSubcategory(subcategory.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              {getLevelIcon(level)}
              <span>{subcategory.name}</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Level {level}
              </Badge>
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground text-sm">-</TableCell>
          <TableCell className="text-center">
            <Badge variant="outline">{subcategory.productCount}</Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleOpenEditSubcategory(subcategory, parentCategory)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && subcategory.childSubcategories?.map((childSubcategory) => renderChildSubcategoryRow(childSubcategory, subcategory, parentCategory, level + 1))}
      </React.Fragment>
    );
  };

  const renderChildSubcategoryRow = (childSubcategory, parentSubcategory, parentCategory, level = 3) => {
    return (
      <TableRow key={`child-${childSubcategory.id}`} className="hover:bg-muted/20">
        <TableCell>
          <div className="flex items-center gap-2" style={{ paddingLeft: `${(level - 1) * 24}px` }}>
            <div className="w-6" />
            {getLevelIcon(level)}
            <span className="text-sm">{childSubcategory.name}</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              Level {level}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">-</TableCell>
        <TableCell className="text-center">
          <Badge variant="outline">{childSubcategory.productCount}</Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleOpenEditChildCategory(childSubcategory, parentSubcategory)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your Men's Apparel & Accessories products into categories</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCategories}
            disabled={isLoading}
            title="Refresh categories"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isCreateChildSubcategoryOpen} onOpenChange={setIsCreateChildSubcategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Child Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Child Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-subcategory">Parent Subcategory</Label>
                  <Select
                    value={childCategoryForm.subCategoryId}
                    onValueChange={(value) => setChildCategoryForm(prev => ({ ...prev, subCategoryId: value }))}
                  >
                    <SelectTrigger id="parent-subcategory">
                      <SelectValue placeholder="Select parent subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-subcategory-name">Child Subcategory Name</Label>
                  <Input
                    id="child-subcategory-name"
                    placeholder="e.g., Slim Fit Jeans"
                    value={childCategoryForm.name}
                    onChange={(e) => setChildCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateChildSubcategoryOpen(false);
                      setChildCategoryForm({ name: '', subCategoryId: '' });
                    }}
                    disabled={isCreatingChildCategory}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCreateChildCategory}
                    disabled={isCreatingChildCategory}
                  >
                    {isCreatingChildCategory ? 'Creating...' : 'Create Child Subcategory'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateSubcategoryOpen} onOpenChange={setIsCreateSubcategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-category">Parent Category</Label>
                  <Select
                    value={subcategoryForm.categoryId}
                    onValueChange={(value) => setSubcategoryForm(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger id="parent-category">
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    placeholder="e.g., Plain / Basic T-Shirts"
                    value={subcategoryForm.name}
                    onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateSubcategoryOpen(false);
                      setSubcategoryForm({ name: '', categoryId: '' });
                    }}
                    disabled={isCreatingSubcategory}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCreateSubcategory}
                    disabled={isCreatingSubcategory}
                  >
                    {isCreatingSubcategory ? 'Creating...' : 'Create Subcategory'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Topwear"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-image">Category Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="category-image"
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('category-image')?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {categoryForm.image ? 'Change Image' : 'Upload Image'}
                      </Button>
                    </div>
                    {categoryForm.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={categoryForm.imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {categoryForm.image?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateCategoryOpen(false);
                      setCategoryForm({ name: '', image: null, imagePreview: null });
                    }}
                    disabled={isCreatingCategory}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory}
                  >
                    {isCreatingCategory ? 'Creating...' : 'Create Category'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Main categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Level 2 across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Child Subcategories</CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChildSubcategories}</div>
            <p className="text-xs text-muted-foreground">Level 3 across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Categorized products</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchCategories} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-muted-foreground">No categories found. Create your first category!</p>
          </div>
        </Card>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => renderCategoryRow(category))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {isLoadingCategoryDetails ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading category details...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  placeholder="e.g., Topwear"
                  value={editCategoryForm.name}
                  onChange={(e) => setEditCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isUpdatingCategory}
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-image">Category Image</Label>
              <div className="space-y-2">
                <Input
                  id="edit-category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditCategoryImageChange}
                  className="hidden"
                />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('edit-category-image')?.click()}
                      className="w-full"
                      disabled={isUpdatingCategory}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {editCategoryForm.image ? 'Change Image' : editCategoryForm.imagePreview ? 'Keep Current Image' : 'Upload Image'}
                    </Button>
                  </div>
                {editCategoryForm.imagePreview && (
                  <div className="mt-2">
                    <img
                      src={editCategoryForm.imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    {editCategoryForm.image && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {editCategoryForm.image.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditCategoryOpen(false);
                    setEditCategoryForm({ id: null, name: '', image: null, imagePreview: null });
                  }}
                  disabled={isUpdatingCategory}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUpdateCategory}
                  disabled={isUpdatingCategory}
                >
                  {isUpdatingCategory ? 'Updating...' : 'Update Category'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          {isLoadingSubcategoryDetails ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading subcategory details...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-parent-category">Parent Category</Label>
                <Select
                  value={editSubcategoryForm.categoryId}
                  onValueChange={(value) => setEditSubcategoryForm(prev => ({ ...prev, categoryId: value }))}
                  disabled={isUpdatingSubcategory}
                >
                  <SelectTrigger id="edit-parent-category">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subcategory-name">Subcategory Name</Label>
                <Input
                  id="edit-subcategory-name"
                  placeholder="e.g., Plain / Basic T-Shirts"
                  value={editSubcategoryForm.name}
                  onChange={(e) => setEditSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isUpdatingSubcategory}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditSubcategoryOpen(false);
                    setEditSubcategoryForm({ id: null, name: '', categoryId: '' });
                  }}
                  disabled={isUpdatingSubcategory}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUpdateSubcategory}
                  disabled={isUpdatingSubcategory}
                >
                  {isUpdatingSubcategory ? 'Updating...' : 'Update Subcategory'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Child Category Dialog */}
      <Dialog open={isEditChildCategoryOpen} onOpenChange={setIsEditChildCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Child Subcategory</DialogTitle>
          </DialogHeader>
          {isLoadingChildCategoryDetails ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading child category details...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-parent-subcategory">Parent Subcategory</Label>
                <Select
                  value={editChildCategoryForm.subCategoryId}
                  onValueChange={(value) => setEditChildCategoryForm(prev => ({ ...prev, subCategoryId: value }))}
                  disabled={isUpdatingChildCategory}
                >
                  <SelectTrigger id="edit-parent-subcategory">
                    <SelectValue placeholder="Select parent subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-child-subcategory-name">Child Subcategory Name</Label>
                <Input
                  id="edit-child-subcategory-name"
                  placeholder="e.g., Slim Fit Jeans"
                  value={editChildCategoryForm.name}
                  onChange={(e) => setEditChildCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isUpdatingChildCategory}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditChildCategoryOpen(false);
                    setEditChildCategoryForm({ id: null, name: '', subCategoryId: '' });
                  }}
                  disabled={isUpdatingChildCategory}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUpdateChildCategory}
                  disabled={isUpdatingChildCategory}
                >
                  {isUpdatingChildCategory ? 'Updating...' : 'Update Child Subcategory'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}