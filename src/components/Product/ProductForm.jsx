// src/components/Product/ProductForm.jsx
// Note: This is an extraction of the form logic for create/edit. It's a reusable component that takes props for mode (create/edit), product data, and handlers.
// For simplicity, I've made it handle both, but the UI is unchanged.

import { useState, useEffect } from "react";
import { Package, Tag, IndianRupee, CreditCard, PackageCheck, FileText, Folder, FolderOpen, Plus, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploader from './ImageUploader';
import VariationsSection from './VariationsSection';
import { categoryHierarchy, materials, fitTypes, occasions, defaultTopwearSizes, defaultBottomwearSizes } from './productsData';

const ProductForm = ({ 
  isOpen, onClose, 
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  onSave,
  title: formTitle = "Product"
}) => {
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
    gst: '',
    metaKeywords: '',
    metaDescription: '',
    images: '',
    variations: [],
  });
  const [selectedVariationColor, setSelectedVariationColor] = useState('');
  const [selectedVariationSizes, setSelectedVariationSizes] = useState([]);
  const [variationStocks, setVariationStocks] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          mainCategory: initialData.category || '',
          subCategory: initialData.subCategory || '',
          childCategory: initialData.childCategory || '',
          sizeType: initialData.category === 'Bottomwear' ? 'Bottomwear' : (initialData.category === 'Topwear' ? 'Topwear' : ''),
          material: initialData.material || '',
          fitType: initialData.fitType || '',
          occasion: initialData.occasion || '',
          description: initialData.description || '',
          careInstructions: initialData.careInstructions || '',
          mrp: initialData.mrp.replace('₹', '') || '',
          sellingPrice: initialData.sellingPrice.replace('₹', '') || '',
          gst: initialData.gst || '',
          metaKeywords: initialData.metaKeywords || '',
          metaDescription: initialData.metaDescription || '',
          images: initialData.images || '',
          variations: initialData.variations || [],
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
          gst: '',
          metaKeywords: '',
          metaDescription: '',
          images: '',
          variations: [],
        });
      }
      setSelectedVariationColor('');
      setSelectedVariationSizes([]);
      setVariationStocks({});
    }
  }, [isOpen, mode, initialData]);

  const subCategories = formData.mainCategory ? Object.keys(categoryHierarchy[formData.mainCategory] || {}) : [];
  const childCategories = formData.mainCategory && formData.subCategory ? Object.keys(categoryHierarchy[formData.mainCategory][formData.subCategory] || {}) : [];
  const availableSizes = formData.sizeType === 'Topwear' ? defaultTopwearSizes : (formData.sizeType === 'Bottomwear' ? defaultBottomwearSizes : []);
  const finalCategory = formData.childCategory || formData.subCategory;

  const handleMainCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, mainCategory: value, subCategory: '', childCategory: '', sizeType: value === 'Bottomwear' ? 'Bottomwear' : (value === 'Topwear' ? 'Topwear' : '') }));
  };

  const handleSubCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, subCategory: value, childCategory: '' }));
  };

  const handleChildCategoryChange = (value) => {
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

  const handleSave = () => {
    if (!finalCategory || formData.variations.length === 0) {
      alert('Please select a final category and add at least one variation.');
      return;
    }
    onSave({
      ...(mode === 'edit' && initialData ? { id: initialData.id } : {}),
      title: formData.title,
      category: formData.mainCategory,
      subCategory: formData.subCategory,
      childCategory: formData.childCategory,
      material: formData.material,
      fitType: formData.fitType,
      occasion: formData.occasion,
      mrp: `₹${formData.mrp}`,
      sellingPrice: `₹${formData.sellingPrice}`,
      gst: formData.gst,
      description: formData.description,
      careInstructions: formData.careInstructions,
      metaKeywords: formData.metaKeywords,
      metaDescription: formData.metaDescription,
      images: formData.images,
      variations: formData.variations
    });
    onClose();
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
              <Select value={formData.mainCategory} onValueChange={handleMainCategoryChange}>
                <SelectTrigger id={`${mode}-mainCategory`} className="h-10 text-sm">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryHierarchy).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-subCategory`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Subcategory
              </Label>
              <Select value={formData.subCategory} onValueChange={handleSubCategoryChange} disabled={!formData.mainCategory}>
                <SelectTrigger id={`${mode}-subCategory`} className="h-10 text-sm">
                  <SelectValue placeholder={formData.mainCategory ? "Select subcategory" : "Select main first"} />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-childCategory`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Child Category
              </Label>
              <Select value={formData.childCategory} onValueChange={handleChildCategoryChange} disabled={!formData.subCategory}>
                <SelectTrigger id={`${mode}-childCategory`} className="h-10 text-sm">
                  <SelectValue placeholder={formData.subCategory ? "Select child category" : "Select sub first"} />
                </SelectTrigger>
                <SelectContent>
                  {childCategories.map((child) => (
                    <SelectItem key={child} value={child}>
                      {child}
                    </SelectItem>
                  ))}
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
          <ImageUploader initialImages={formData.images ? formData.images.split(',') : []} onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))} />
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
              <Label htmlFor={`${mode}-gst`} className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
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
          <Button className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90" onClick={handleSave} disabled={!finalCategory || formData.variations.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            {mode === 'create' ? 'Create Product' : 'Save Changes'}
          </Button>
          <Button variant="outline" className="flex-1 h-10 sm:h-auto" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductForm;