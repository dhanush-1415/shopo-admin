// src/components/Product/ProductViewer.jsx
import { Package, IndianRupee, CreditCard, Tag, Award, Hash, FileText, Image as ImageIcon, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { API_CONFIG } from '@/api/config';

// Transform API product data to match viewer expectations
const transformProductForViewer = (apiProduct) => {
  // If already transformed (from list), return as is
  if (apiProduct.title) {
    return apiProduct;
  }

  // Transform from API response
  const categoryName = apiProduct.category?.name || apiProduct.Category?.name || 'N/A';
  const subCategoryName = apiProduct.subCategory?.name || apiProduct.SubCategory?.name || 'N/A';
  const childCategoryName = apiProduct.childCategory?.name || apiProduct.ChildCategory?.name || null;
  
  // Get images
  const thumbnailImage = apiProduct.thumbnailImage 
    ? (apiProduct.thumbnailImage.startsWith('http') 
        ? apiProduct.thumbnailImage 
        : `${API_CONFIG.BASE_URL}/${apiProduct.thumbnailImage}`)
    : null;
  // galleryImage can be an array of URLs or a single string
  const galleryImages = Array.isArray(apiProduct.galleryImage) 
    ? apiProduct.galleryImage 
    : (apiProduct.galleryImage ? [apiProduct.galleryImage] : []);
  const allImages = [thumbnailImage, ...galleryImages].filter(Boolean);

  // Calculate total stock
  const totalStock = apiProduct.inventories?.reduce((sum, inv) => sum + (inv.availableQuantity || 0), 0) || 0;

  // Get variations/inventory
  const variations = apiProduct.inventories?.map(inv => {
    const color = inv.productColor?.color || 'N/A';
    const sizes = Array.isArray(inv.productSize?.size) 
      ? inv.productSize.size 
      : (inv.productSize?.size ? [inv.productSize.size] : []);
    
    return sizes.map(size => ({
      color,
      size,
      stock: inv.availableQuantity || 0,
    }));
  }).flat() || [];

  return {
    id: apiProduct.id,
    title: apiProduct.name || 'Untitled Product',
    category: categoryName,
    subCategory: subCategoryName,
    childCategory: childCategoryName,
    description: apiProduct.description || '',
    mrp: `₹${apiProduct.mrp || 0}`,
    sellingPrice: `₹${apiProduct.sellingPrice || 0}`,
    stockQty: totalStock,
    images: allImages.join(','),
    material: apiProduct.material?.name || apiProduct.productMaterialId || 'N/A',
    fitType: apiProduct.fitType || 'N/A',
    occasion: apiProduct.occasion?.name || (apiProduct.occasionId ? 'N/A' : 'N/A'),
    seasonal: apiProduct.seasonal || 'N/A',
    careInstructions: apiProduct.careInstructions || '',
    metaKeywords: apiProduct.metaTitle || '',
    metaDescription: apiProduct.metaDescription || '',
    variations: variations,
    gst: apiProduct.gst || 0,
    status: apiProduct.status || 'active',
    color: variations[0]?.color || 'N/A',
  };
};

const ProductViewer = ({ product, onEdit }) => {
  const transformedProduct = transformProductForViewer(product);
  
  return (
  <>
    <DialogHeader className="p-6 border-b">
      <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Package className="h-5 w-5" />
        Product Details
      </DialogTitle>
    </DialogHeader>
    <div className="p-6 overflow-y-auto space-y-6">
      {/* Product Header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="grid grid-cols-2 gap-2">
              {transformedProduct.images && transformedProduct.images.split(',').filter(img => img.trim()).length > 0 ? (
                transformedProduct.images.split(',').filter(img => img.trim()).map((img, index) => (
                  <img
                    key={index}
                    src={img.trim()}
                    alt={`${transformedProduct.title} ${index + 1}`}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                  />
                ))
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl md:text-2xl font-bold">{transformedProduct.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{transformedProduct.description}</p>
            {transformedProduct.color && transformedProduct.color !== 'N/A' && (
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-medium">Color:</span>
                <Badge variant="outline" className="text-xs md:text-sm">{transformedProduct.color}</Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <IndianRupee className="h-4 w-4" />
            <span className="text-xs md:text-sm">Selling Price</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-primary">{transformedProduct.sellingPrice}</p>
          <p className="text-xs text-muted-foreground">MRP: {transformedProduct.mrp}</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Package className="h-4 w-4" />
            <span className="text-xs md:text-sm">Stock</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{transformedProduct.stockQty}</p>
          <p className="text-xs text-muted-foreground">units available</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-xs md:text-sm">Category</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{transformedProduct.category}</p>
          <p className="text-xs text-muted-foreground">{transformedProduct.subCategory} {transformedProduct.childCategory && ` / ${transformedProduct.childCategory}`}</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Award className="h-4 w-4" />
            <span className="text-xs md:text-sm">Material</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{transformedProduct.material}</p>
          <p className="text-xs text-muted-foreground">fabric</p>
        </Card>
      </div>

      {/* Product Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Basic Information
          </h3>
          <Card className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Title</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.title}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.description}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Category</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs md:text-sm">{transformedProduct.category}</Badge>
                <Badge variant="outline" className="text-xs md:text-sm">{transformedProduct.subCategory}</Badge>
                {transformedProduct.childCategory && <Badge variant="outline" className="text-xs md:text-sm">{transformedProduct.childCategory}</Badge>}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Product Details
          </h3>
          <Card className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Material</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.material}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Fit Type</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.fitType}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Occasion</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.occasion}</p>
            </div>
            <Separator />
            {transformedProduct.color && transformedProduct.color !== 'N/A' && (
              <>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Color</p>
                  <Badge variant="outline" className="text-xs md:text-sm">{transformedProduct.color}</Badge>
                </div>
                <Separator />
              </>
            )}
            {transformedProduct.variations && transformedProduct.variations.length > 0 && (
              <>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Variations</p>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Color</TableHead>
                          <TableHead className="w-[80px]">Size</TableHead>
                          <TableHead className="w-[80px]">Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transformedProduct.variations.map((v, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs">{v.color}</TableCell>
                            <TableCell className="text-xs">{v.size}</TableCell>
                            <TableCell className="text-xs">{v.stock}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Care Instructions */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Care Instructions
        </h3>
        <Card className="p-4 md:p-6">
          <p className="text-sm md:text-base">{transformedProduct.careInstructions || 'No care instructions provided'}</p>
        </Card>
      </div>

      {/* SEO Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            SEO Information
          </h3>
          <Card className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Meta Keywords</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.metaKeywords || 'N/A'}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Meta Description</p>
              <p className="font-medium text-sm md:text-base">{transformedProduct.metaDescription || 'N/A'}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1" onClick={() => onEdit(transformedProduct)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>
    </div>
  </>
  );
};

export default ProductViewer;