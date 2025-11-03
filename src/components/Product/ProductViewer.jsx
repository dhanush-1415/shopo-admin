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

const ProductViewer = ({ product, onEdit }) => (
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
              {product.images && product.images.split(',').filter(img => img.trim()).length > 0 ? (
                product.images.split(',').filter(img => img.trim()).map((img, index) => (
                  <img
                    key={index}
                    src={img.trim()}
                    alt={`${product.title} ${index + 1}`}
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
            <h2 className="text-xl md:text-2xl font-bold">{product.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-medium">Color:</span>
              <Badge variant="outline" className="text-xs md:text-sm">{product.color}</Badge>
            </div>
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
          <p className="text-lg md:text-2xl font-bold text-primary">{product.sellingPrice}</p>
          <p className="text-xs text-muted-foreground">MRP: {product.mrp}</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Package className="h-4 w-4" />
            <span className="text-xs md:text-sm">Stock</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{product.stockQty}</p>
          <p className="text-xs text-muted-foreground">units available</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-xs md:text-sm">Category</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{product.category}</p>
          <p className="text-xs text-muted-foreground">{product.subCategory} {product.childCategory && ` / ${product.childCategory}`}</p>
        </Card>

        <Card className="p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Award className="h-4 w-4" />
            <span className="text-xs md:text-sm">Material</span>
          </div>
          <p className="text-lg md:text-2xl font-bold">{product.material}</p>
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
              <p className="font-medium text-sm md:text-base">{product.title}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-sm md:text-base">{product.description}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Category</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs md:text-sm">{product.category}</Badge>
                <Badge variant="outline" className="text-xs md:text-sm">{product.subCategory}</Badge>
                {product.childCategory && <Badge variant="outline" className="text-xs md:text-sm">{product.childCategory}</Badge>}
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
              <p className="font-medium text-sm md:text-base">{product.material}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Fit Type</p>
              <p className="font-medium text-sm md:text-base">{product.fitType}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Occasion</p>
              <p className="font-medium text-sm md:text-base">{product.occasion}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Color</p>
              <Badge variant="outline" className="text-xs md:text-sm">{product.color}</Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Sizes Available</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.split(',').map((size) => (
                  <Badge key={size} variant="secondary" className="text-xs">
                    {size.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
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
                    {product.variations.map((v, i) => (
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
          <p className="text-sm md:text-base">{product.careInstructions}</p>
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
              <p className="font-medium text-sm md:text-base">{product.metaKeywords}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-muted-foreground">Meta Description</p>
              <p className="font-medium text-sm md:text-base">{product.metaDescription}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>
    </div>
  </>
);

export default ProductViewer;