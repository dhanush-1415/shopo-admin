// src/components/Product/ProductForm.jsx
// Note: This is an extraction of the form logic for create/edit. It's a reusable component that takes props for mode (create/edit), product data, and handlers.
// For simplicity, I've made it handle both, but the UI is unchanged.

import { useState, useEffect, useMemo } from "react";
import { Package, Tag, IndianRupee, CreditCard, PackageCheck, FileText, Folder, FolderOpen, Plus, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';
import VariationsSection from './VariationsSection';
import { categoryHierarchy, materials, fitTypes, occasions } from './productsData';
import { createProduct } from '@/api/services/productService';
import { getAllCategories } from '@/api/services/categoryService';
import { getAllSizes } from '@/api/services/sizeService';
import { useAuthStore } from '@/store/authStore';

const ProductForm = ({ 
  isOpen, onClose, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  onSave,
  title: formTitle = "Product"
}) => {
  const { getToken } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [apiSizes, setApiSizes] = useState([]);
  const [isLoadingSizes, setIsLoadingSizes] = useState(false);
  const [topwearSizes, setTopwearSizes] = useState([]);
  const [bottomwearSizes, setBottomwearSizes] = useState([]);
  
  // Common state for both create and edit
  const [formData, setFormData] = useState({
    title: '',
    mainCategory: '',
    subCategory: '',
    childCategory: '',
    sizeType: '',
    material: '',
    fitType: '',
    occasion: '',
    description: '',
    careInstructions: '',
    mrp: '',
    sellingPrice: '',
    gst: '5',
    metaKeywords: '',
    metaDescription: '',
    images: '',
    variations: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedVariationColor, setSelectedVariationColor] = useState('');
  const [selectedVariationSizes, setSelectedVariationSizes] = useState([]);
  const [variationStocks, setVariationStocks] = useState({});
  const [seasonalCategory, setSeasonalCategory] = useState(''); // UI only, not sent in payload

  // Fetch categories from API when dialog opens
  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen) {
        setIsLoadingCategories(true);
        try {
          const token = getToken();
          const response = await getAllCategories(token);
          if (response.success) {
            setApiCategories(response.data || []);
          } else {
            toast.error('Failed to load categories');
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          toast.error('Failed to load categories');
        } finally {
          setIsLoadingCategories(false);
        }
      } else {
        // Reset categories when dialog closes
        setApiCategories([]);
      }
    };
    fetchCategories();
  }, [isOpen, getToken]);

  // Fetch sizes from API when dialog opens
  useEffect(() => {
    const fetchSizes = async () => {
      if (isOpen) {
        setIsLoadingSizes(true);
        try {
          const token = getToken();
          const response = await getAllSizes(token);
          if (response.success) {
            setApiSizes(response.data || []);
            
            // Extract topwear and bottomwear sizes
            const topwearData = response.data.find(item => 
              item.type?.toLowerCase() === 'topwear'
            );
            const bottomwearData = response.data.find(item => 
              item.type?.toLowerCase() === 'bottomwear'
            );
            
            setTopwearSizes(topwearData?.size || []);
            setBottomwearSizes(bottomwearData?.size || []);
          } else {
            toast.error('Failed to load sizes');
            setTopwearSizes([]);
            setBottomwearSizes([]);
          }
        } catch (error) {
          console.error('Failed to fetch sizes:', error);
          toast.error('Failed to load sizes');
          setTopwearSizes([]);
          setBottomwearSizes([]);
        } finally {
          setIsLoadingSizes(false);
        }
      } else {
        // Reset sizes when dialog closes
        setTopwearSizes([]);
        setBottomwearSizes([]);
      }
    };
    fetchSizes();
  }, [isOpen, getToken]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        // Handle mrp and sellingPrice - can be number or string with ₹
        const getNumericValue = (value) => {
          if (typeof value === 'number') return value.toString();
          if (typeof value === 'string') return value.replace('₹', '').trim();
          return '';
        };

        // Get category IDs from API data
        const categoryId = initialData.categoryId || initialData.category?.id || initialData._original?.categoryId || '';
        const subCategoryId = initialData.subCategoryId || initialData.subCategory?.id || initialData._original?.subCategoryId || '';
        const childCategoryId = initialData.childCategoryId || initialData.childCategory?.id || initialData._original?.childCategoryId || '';

        setFormData({
          title: initialData.name || initialData.title || '',
          mainCategory: categoryId.toString(), // Store category ID
          subCategory: subCategoryId.toString(), // Store subcategory ID
          childCategory: childCategoryId ? childCategoryId.toString() : '',
          sizeType: '', // Will be determined from category
          material: initialData.material?.name || initialData.productMaterialId?.toString() || initialData.material || '',
          fitType: initialData.fitType || '',
          occasion: initialData.occasion?.name || initialData.occasionId?.toString() || initialData.occasion || '',
          description: initialData.description || '',
          careInstructions: initialData.careInstructions || '',
          mrp: getNumericValue(initialData.mrp),
          sellingPrice: getNumericValue(initialData.sellingPrice),
          gst: initialData.gst?.toString() || '5',
          metaKeywords: initialData.metaTitle || initialData.metaKeywords || '',
          metaDescription: initialData.metaDescription || '',
          images: initialData.images || initialData.thumbnailImage || '',
          variations: (() => {
            // If variations already in correct format, use them
            if (Array.isArray(initialData.variations) && initialData.variations.length > 0 && initialData.variations[0].color) {
              return initialData.variations;
            }
            // Transform inventories to variations format
            if (Array.isArray(initialData.inventories)) {
              return initialData.inventories.flatMap(inv => {
                const color = inv.productColor?.color || 'N/A';
                const sizes = Array.isArray(inv.productSize?.size) 
                  ? inv.productSize.size 
                  : (inv.productSize?.size ? [inv.productSize.size] : []);
                return sizes.map(size => ({
                  color,
                  size,
                  stock: inv.availableQuantity || 0,
                }));
              });
            }
            return [];
          })(),
        });
      } else {
        // Reset for create
        setFormData({
          title: '',
          mainCategory: '',
          subCategory: '',
          childCategory: '',
          sizeType: '',
          material: '',
          fitType: '',
          occasion: '',
          description: '',
          careInstructions: '',
          mrp: '',
          sellingPrice: '',
          gst: '5',
          metaKeywords: '',
          metaDescription: '',
          images: '',
          variations: [],
        });
      }
      setSelectedVariationColor('');
      setSelectedVariationSizes([]);
      setVariationStocks({});
      setImageFiles([]);
      setSeasonalCategory('');
    }
  }, [isOpen, mode, initialData]);

  // Get selected category from API data (formData stores IDs in edit mode)
  const selectedCategory = apiCategories.find(cat => 
    cat.id?.toString() === formData.mainCategory || cat.name === formData.mainCategory
  );
  
  // Get subcategories from selected category
  const subCategories = selectedCategory?.ProductSubCategories || [];
  
  // Get selected subcategory (formData stores IDs in edit mode)
  const selectedSubcategory = subCategories.find(sub => 
    sub.id?.toString() === formData.subCategory || sub.name === formData.subCategory
  );
  
  // Get child categories from selected subcategory
  const childCategories = selectedSubcategory?.ProductChildCategories || [];

  // Update sizeType based on category when category is selected
  useEffect(() => {
    if (selectedCategory && mode === 'edit') {
      const categoryName = selectedCategory.name?.toLowerCase() || '';
      if (categoryName.includes('bottom')) {
        setFormData(prev => ({ ...prev, sizeType: 'Bottomwear' }));
      } else if (categoryName.includes('top')) {
        setFormData(prev => ({ ...prev, sizeType: 'Topwear' }));
      }
    }
  }, [selectedCategory, mode]);
  
  const availableSizes = formData.sizeType === 'Topwear' ? topwearSizes : (formData.sizeType === 'Bottomwear' ? bottomwearSizes : []);
  // finalCategory is used for validation - check if at least subcategory is selected
  const finalCategory = formData.childCategory || formData.subCategory;

  const handleMainCategoryChange = (value) => {
    // value is the category ID
    const category = apiCategories.find(cat => cat.id?.toString() === value);
    setFormData(prev => ({ 
      ...prev, 
      mainCategory: value, // Store ID
      subCategory: '', 
      childCategory: '',
      sizeType: category?.name?.toLowerCase().includes('bottom') ? 'Bottomwear' : 
                 (category?.name?.toLowerCase().includes('top') ? 'Topwear' : '')
    }));
  };

  const handleSubCategoryChange = (value) => {
    // value is the subcategory ID
    setFormData(prev => ({ ...prev, subCategory: value, childCategory: '' }));
  };

  const handleChildCategoryChange = (value) => {
    // value is the child category ID
    setFormData(prev => ({ ...prev, childCategory: value }));
  };

  const handleToggleSize = (size, checked) => {
    if (checked) {
      if (!selectedVariationSizes.includes(size)) {
        setSelectedVariationSizes([...selectedVariationSizes, size]);
        setVariationStocks(prev => ({ ...prev, [size]: 0 }));
      }
    } else {
      setSelectedVariationSizes(prev => prev.filter(s => s !== size));
      setVariationStocks(prev => {
        const newStocks = { ...prev };
        delete newStocks[size];
        return newStocks;
      });
    }
  };

  const handleAddVariation = () => {
    if (!selectedVariationColor || selectedVariationSizes.length === 0 || !finalCategory) return;

    const newVariations = selectedVariationSizes.map(size => ({
      color: selectedVariationColor,
      size,
      stock: variationStocks[size] || 0
    }));

    const hasDuplicate = newVariations.some(newVar => 
      formData.variations.some(v => v.color === newVar.color && v.size === newVar.size)
    );
    if (hasDuplicate) {
      alert('Duplicate variation: Color-Size combination already exists.');
      return;
    }

    setFormData(prev => ({ ...prev, variations: [...prev.variations, ...newVariations] }));
    setSelectedVariationColor('');
    setSelectedVariationSizes([]);
    setVariationStocks({});
  };

  const handleEditStock = (index, newStock) => {
    setFormData(prev => {
      const updated = [...prev.variations];
      updated[index].stock = parseInt(newStock) || 0;
      return { ...prev, variations: updated };
    });
  };

  const handleDeleteVariation = (index) => {
    setFormData(prev => ({ ...prev, variations: prev.variations.filter((_, i) => i !== index) }));
  };

  // Helper function to get category IDs (formData already stores IDs)
  const getCategoryIds = () => {
    if (!formData.mainCategory || !formData.subCategory) {
      toast.error('Please select category and subcategory');
      return { categoryId: '', subCategoryId: '', childCategoryId: '' };
    }

    return {
      categoryId: formData.mainCategory.toString(),
      subCategoryId: formData.subCategory.toString(),
      childCategoryId: formData.childCategory ? formData.childCategory.toString() : '',
    };
  };

  // Helper to get material ID
  const getMaterialId = (materialName) => {
    // TODO: Replace with actual material ID lookup
    const materialMap = {
      'Cotton': 1,
      'Polyester': 2,
      'Linen': 3,
      'Denim': 4,
      // Add more mappings as needed
    };
    return materialMap[materialName] || 1;
  };

  // Helper to get occasion ID
  const getOccasionId = (occasionName) => {
    // TODO: Replace with actual occasion ID lookup
    const occasionMap = {
      'Casual': 1,
      'Formal': 2,
      'Party': 3,
      'Sports': 4,
      // Add more mappings as needed
    };
    return occasionMap[occasionName] || 1;
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title) {
      toast.error('Please enter product title');
      return;
    }
    if (!finalCategory || formData.variations.length === 0) {
      toast.error('Please select a final category and add at least one variation.');
      return;
    }
    if (!formData.mrp || !formData.sellingPrice) {
      toast.error('Please enter MRP and Selling Price');
      return;
    }
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (mode === 'create') {
      setIsSubmitting(true);
      try {
        const categoryIds = getCategoryIds();
        
        // Map inventory from variations
        const inventory = formData.variations.map(v => ({
          color: v.color,
          size: v.size,
          availableQty: v.stock || 0,
        }));

        // Prepare apparel details
        const apparelDetails = {
          materialId: getMaterialId(formData.material),
          fitType: formData.fitType,
          occasionId: getOccasionId(formData.occasion),
          seasonal: 'All', // Default or add field to form
        };

        // Prepare product data for API
        const productData = {
          name: formData.title,
          description: formData.description,
          metaTitle: formData.metaKeywords || formData.title,
          metaDescription: formData.metaDescription || formData.description,
          careInstructions: formData.careInstructions,
          categoryId: categoryIds.categoryId,
          subCategoryId: categoryIds.subCategoryId,
          ...(categoryIds.childCategoryId && { childCategoryId: categoryIds.childCategoryId }), // Only include if present
          apparelDetails,
          inventory,
          mrp: formData.mrp,
          sellingPrice: formData.sellingPrice,
          gst: formData.gst || '5',
          thumbnailImage: imageFiles[0], // First image as thumbnail
          galleryImage: imageFiles[1] || imageFiles[0], // Second image or first as gallery
        };

        const token = getToken();
        const response = await createProduct(productData, token);

        if (response.success) {
          toast.success('Product created successfully!');
          onSave(response.data);
          onClose();
        } else {
          toast.error(response.error || 'Failed to create product');
        }
      } catch (error) {
        toast.error(error.message || 'An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Edit mode - call onSave with form data (existing behavior)
      onSave({
        ...(initialData ? { id: initialData.id } : {}),
        title: formData.title,
        category: formData.mainCategory,
        subCategory: formData.subCategory,
        childCategory: formData.childCategory,
        material: formData.material,
        fitType: formData.fitType,
        occasion: formData.occasion,
        mrp: `₹${formData.mrp}`,
        sellingPrice: `₹${formData.sellingPrice}`,
        description: formData.description,
        careInstructions: formData.careInstructions,
        metaKeywords: formData.metaKeywords,
        metaDescription: formData.metaDescription,
        images: formData.images,
        variations: formData.variations
      });
      onClose();
    }
  };

  const totalStock = formData.variations.reduce((sum, v) => sum + v.stock, 0);

  if (!isOpen) return null;

  return (
    <>
      <DialogHeader className="px-6 py-4 border-b">
        <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          {mode === 'create' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          {mode === 'create' ? 'Create' : 'Edit'} {formTitle}
        </DialogTitle>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          {mode === 'create' ? 'Add a new product to your inventory.' : 'Update product details to keep your inventory accurate.'}
        </p>
      </DialogHeader>
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-title`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Title
              </Label>
              <Input id={`${mode}-title`} value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="h-10 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-mainCategory`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Main Category
              </Label>
              <Select 
                value={formData.mainCategory} 
                onValueChange={handleMainCategoryChange}
                disabled={isLoadingCategories}
              >
                <SelectTrigger id={`${mode}-mainCategory`} className="h-10 text-sm">
                  <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select main category"} />
                </SelectTrigger>
                <SelectContent>
                  {apiCategories.length > 0 ? (
                    apiCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id?.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      {isLoadingCategories ? "Loading..." : "No categories available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-subCategory`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Subcategory
              </Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={handleSubCategoryChange} 
                disabled={!formData.mainCategory || subCategories.length === 0}
              >
                <SelectTrigger id={`${mode}-subCategory`} className="h-10 text-sm">
                  <SelectValue 
                    placeholder={
                      !formData.mainCategory 
                        ? "Select main first" 
                        : subCategories.length === 0 
                        ? "No subcategories available" 
                        : "Select subcategory"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.length > 0 ? (
                    subCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id?.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-subcategories" disabled>
                      No subcategories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-childCategory`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Child Category
              </Label>
              <Select 
                value={formData.childCategory} 
                onValueChange={handleChildCategoryChange} 
                disabled={!formData.subCategory || childCategories.length === 0}
              >
                <SelectTrigger id={`${mode}-childCategory`} className="h-10 text-sm">
                  <SelectValue 
                    placeholder={
                      !formData.subCategory 
                        ? "Select sub first" 
                        : childCategories.length === 0 
                        ? "No child categories available (optional)" 
                        : "Select child category (optional)"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {childCategories.length > 0 ? (
                    childCategories.map((child) => (
                      <SelectItem key={child.id} value={child.id?.toString()}>
                        {child.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-child-categories" disabled>
                      No child categories available (optional)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Apparel Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Apparel Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-material`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Material
              </Label>
              <Select value={formData.material} onValueChange={(val) => setFormData(prev => ({ ...prev, material: val }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-fitType`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Fit Type
              </Label>
              <Select value={formData.fitType} onValueChange={(val) => setFormData(prev => ({ ...prev, fitType: val }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select fit type" />
                </SelectTrigger>
                <SelectContent>
                  {fitTypes.map((fit) => (
                    <SelectItem key={fit} value={fit}>
                      {fit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-occasion`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Occasion
              </Label>
              <Select value={formData.occasion} onValueChange={(val) => setFormData(prev => ({ ...prev, occasion: val }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occasion) => (
                    <SelectItem key={occasion} value={occasion}>
                      {occasion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-sizeType`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Size Variation Type
              </Label>
              <Select value={formData.sizeType} onValueChange={(val) => setFormData(prev => ({ ...prev, sizeType: val }))}>
                <SelectTrigger id={`${mode}-sizeType`} className="h-10 text-sm">
                  <SelectValue placeholder="Select size type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Topwear">Topwear (S, M, L, etc.)</SelectItem>
                  <SelectItem value="Bottomwear">Bottomwear (28, 30, etc.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-seasonal`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Seasonal
              </Label>
              <Select 
                value={seasonalCategory} 
                onValueChange={setSeasonalCategory}
                disabled={isLoadingCategories}
              >
                <SelectTrigger id={`${mode}-seasonal`} className="h-10 text-sm">
                  <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select seasonal category"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : apiCategories.length > 0 ? (
                    apiCategories.map((category) => (
                      <SelectItem key={category.id || category.name} value={category.id?.toString() || category.name}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.sizeType && (
            <VariationsSection
              variations={formData.variations}
              setVariations={(vars) => setFormData(prev => ({ ...prev, variations: vars }))}
              selectedColor={selectedVariationColor}
              setSelectedColor={setSelectedVariationColor}
              selectedSizes={selectedVariationSizes}
              setSelectedSizes={setSelectedVariationSizes}
              variationStocks={variationStocks}
              setVariationStocks={setVariationStocks}
              availableSizes={availableSizes}
              finalCategory={finalCategory}
              toggleSize={handleToggleSize}
              addVariation={handleAddVariation}
              editStock={handleEditStock}
              deleteVariation={handleDeleteVariation}
              prefix={mode}
            />
          )}
          <ImageUploader 
            initialImages={formData.images ? formData.images.split(',') : []} 
            onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
            onFilesChange={(files) => setImageFiles(files)}
          />
        </div>

        {/* Pricing & Inventory Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Pricing & Inventory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-mrp`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                MRP (₹)
              </Label>
              <Input id={`${mode}-mrp`} value={formData.mrp} onChange={(e) => setFormData(prev => ({ ...prev, mrp: e.target.value }))} type="number" step="0.01" className="h-10 text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-sellingPrice`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Selling Price (₹)
              </Label>
              <Input id={`${mode}-sellingPrice`} value={formData.sellingPrice} onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))} type="number" step="0.01" className="h-10 text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-gst`} className="text-xs md:text-sm font-medium text-muted-foreground">
                GST (%)
              </Label>
              <Input id={`${mode}-gst`} value={formData.gst} onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value }))} type="number" step="0.01" className="h-10 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                Total Stock
              </Label>
              <Input 
                value={totalStock} 
                readOnly 
                className="h-10 text-sm bg-muted" 
              />
            </div>
          </div>
        </div>

        {/* Description & Care */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-description`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea id={`${mode}-description`} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="min-h-[100px] resize-none text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-careInstructions`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Care Instructions
            </Label>
            <Textarea id={`${mode}-careInstructions`} value={formData.careInstructions} onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))} className="min-h-[100px] resize-none text-sm" />
          </div>
        </div>

        {/* SEO Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" />
            SEO Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-metaKeywords`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Meta Keywords (comma-separated)
              </Label>
              <Input id={`${mode}-metaKeywords`} value={formData.metaKeywords} onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))} placeholder="keyword1, keyword2" className="h-10 text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-metaDescription`} className="text-xs md:text-sm font-medium text-muted-foreground">
                Meta Description
              </Label>
              <Textarea id={`${mode}-metaDescription`} value={formData.metaDescription} onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))} className="min-h-[80px] resize-none text-sm" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90" 
            onClick={handleSave} 
            disabled={!finalCategory || formData.variations.length === 0 || isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creating...' : (mode === 'create' ? 'Create Product' : 'Save Changes')}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-10 sm:h-auto" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductForm;