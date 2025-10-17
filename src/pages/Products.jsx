import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Package, DollarSign, Tag, Hash, Folder, FolderOpen, Award, Circle, CreditCard, PackageCheck, Scale, Ruler, FileText, ListOrdered, Save, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    sku: 'HD-001',
    category: 'Electronics',
    subcategory: 'Audio Devices',
    price: '$299',
    costPrice: '$180',
    stock: 45,
    status: 'active',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    specifications: 'Bluetooth 5.0, 30-hour battery life, Active noise cancellation',
    weight: '250g',
    dimensions: '18 x 15 x 8 cm',
    brand: 'AudioTech',
    sold: 234
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    sku: 'MS-002',
    category: 'Accessories',
    subcategory: 'Computer Peripherals',
    price: '$49',
    costPrice: '$25',
    stock: 120,
    status: 'active',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    specifications: '2.4GHz wireless, 1600 DPI, 6 months battery',
    weight: '85g',
    dimensions: '12 x 6 x 4 cm',
    brand: 'TechGear',
    sold: 567
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    sku: 'KB-003',
    category: 'Accessories',
    subcategory: 'Computer Peripherals',
    price: '$149',
    costPrice: '$89',
    stock: 67,
    status: 'active',
    description: 'RGB mechanical keyboard with customizable keys and tactile switches.',
    specifications: 'Cherry MX Blue switches, RGB backlight, Programmable keys',
    weight: '900g',
    dimensions: '44 x 13 x 4 cm',
    brand: 'KeyMaster',
    sold: 189
  },
  {
    id: 4,
    name: 'Gaming Monitor',
    sku: 'MN-004',
    category: 'Electronics',
    subcategory: 'Displays',
    price: '$499',
    costPrice: '$320',
    stock: 23,
    status: 'low',
    description: '27-inch 4K gaming monitor with high refresh rate and HDR support.',
    specifications: '27" 4K, 144Hz, HDR10, 1ms response time',
    weight: '5.2kg',
    dimensions: '61 x 46 x 22 cm',
    brand: 'ViewPro',
    sold: 98
  },
  {
    id: 5,
    name: 'USB-C Hub',
    sku: 'HB-005',
    category: 'Accessories',
    subcategory: 'Computer Peripherals',
    price: '$79',
    costPrice: '$42',
    stock: 0,
    status: 'out',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.',
    specifications: '1x HDMI, 3x USB 3.0, SD/microSD, 100W PD',
    weight: '120g',
    dimensions: '11 x 4 x 1.5 cm',
    brand: 'ConnectPlus',
    sold: 345
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button className="gap-2 px-4 sm:px-6 h-10 sm:h-auto">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 h-10 sm:h-auto" />
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
              <TableHead className="text-left sm:text-center">Product</TableHead>
              <TableHead className="text-left sm:text-center">SKU</TableHead>
              <TableHead className="text-left sm:text-center">Category</TableHead>
              <TableHead className="text-left sm:text-center">Price</TableHead>
              <TableHead className="text-left sm:text-center">Stock</TableHead>
              <TableHead className="text-left sm:text-center">Status</TableHead>
              <TableHead className="text-left sm:text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const salePrice = parseFloat(product.price.replace('$', ''));
              const costPriceNum = parseFloat(product.costPrice.replace('$', ''));
              const totalProfit = ((salePrice - costPriceNum) * product.sold).toLocaleString();
              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-left sm:text-center">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground text-left sm:text-center">{product.sku}</TableCell>
                  <TableCell className="text-left sm:text-center">{product.category}</TableCell>
                  <TableCell className="font-semibold text-left sm:text-center">{product.price}</TableCell>
                  <TableCell className="text-left sm:text-center">{product.stock}</TableCell>
                  <TableCell className="text-left sm:text-center">
                    <Badge
                      variant={
                        product.status === 'active'
                          ? 'default'
                          : product.status === 'low'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {product.status === 'active' ? 'In Stock' : product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
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
                              <Package className="h-5 w-5" />
                              Product Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="p-6 overflow-y-auto space-y-6">
                            {/* Product Header */}
                            <Card className="overflow-hidden">
                              <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                                <div className="flex-shrink-0 mb-4 md:mb-0">
                                  <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                                    <ImageIcon className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <h2 className="text-xl md:text-2xl font-bold">{product.name}</h2>
                                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs md:text-sm font-medium">Brand:</span>
                                    <Badge variant="outline" className="text-xs md:text-sm">{product.brand}</Badge>
                                  </div>
                                  <Badge
                                    variant={
                                      product.status === 'active'
                                        ? 'default'
                                        : product.status === 'low'
                                          ? 'secondary'
                                          : 'destructive'
                                    }
                                    className="text-xs md:text-sm mt-2"
                                  >
                                    {product.status === 'active' ? 'In Stock' : product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                                  </Badge>
                                </div>
                              </div>
                            </Card>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <Card className="p-4 md:p-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="text-xs md:text-sm">Price</span>
                                </div>
                                <p className="text-lg md:text-2xl font-bold text-primary">{product.price}</p>
                                <p className="text-xs text-muted-foreground">Cost: {product.costPrice}</p>
                              </Card>

                              <Card className="p-4 md:p-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                  <Package className="h-4 w-4" />
                                  <span className="text-xs md:text-sm">Stock</span>
                                </div>
                                <p className="text-lg md:text-2xl font-bold">{product.stock}</p>
                                <p className="text-xs text-muted-foreground">units available</p>
                              </Card>

                              <Card className="p-4 md:p-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                  <Tag className="h-4 w-4" />
                                  <span className="text-xs md:text-sm">Sold</span>
                                </div>
                                <p className="text-lg md:text-2xl font-bold">{product.sold}</p>
                                <p className="text-xs text-muted-foreground">total units</p>
                              </Card>

                              <Card className="p-4 md:p-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="text-xs md:text-sm">Profit</span>
                                </div>
                                <p className="text-lg md:text-2xl font-bold text-green-600">${totalProfit}</p>
                                <p className="text-xs text-muted-foreground">total earned</p>
                              </Card>
                            </div>

                            {/* Product Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                  <Folder className="h-4 w-4" />
                                  Basic Information
                                </h3>
                                <Card className="p-4 md:p-6 space-y-4">
                                  <div className="space-y-2">
                                    <p className="text-xs md:text-sm text-muted-foreground">SKU</p>
                                    <p className="font-mono font-medium text-sm md:text-base">{product.sku}</p>
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <p className="text-xs md:text-sm text-muted-foreground">Category</p>
                                    <p className="font-medium text-sm md:text-base">{product.category}</p>
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <p className="text-xs md:text-sm text-muted-foreground">Subcategory</p>
                                    <p className="font-medium text-sm md:text-base">{product.subcategory}</p>
                                  </div>
                                </Card>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                  <Ruler className="h-4 w-4" />
                                  Physical Details
                                </h3>
                                <Card className="p-4 md:p-6 space-y-4">
                                  <div className="space-y-2">
                                    <p className="text-xs md:text-sm text-muted-foreground">Weight</p>
                                    <p className="font-medium text-sm md:text-base">{product.weight}</p>
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <p className="text-xs md:text-sm text-muted-foreground">Dimensions</p>
                                    <p className="font-medium text-sm md:text-base">{product.dimensions}</p>
                                  </div>
                                </Card>
                              </div>
                            </div>

                            {/* Specifications */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <ListOrdered className="h-4 w-4" />
                                Specifications
                              </h3>
                              <Card className="p-4 md:p-6">
                                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                                  {product.specifications.split(',').map((spec, index) => (
                                    <li key={index} className="text-muted-foreground">{spec.trim()}</li>
                                  ))}
                                </ul>
                              </Card>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                              <Button variant="outline" className="flex-1">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                              </Button>
                              <Button variant="destructive" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Product
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
                              Edit Product - {product.name}
                            </DialogTitle>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">Update product details to keep your inventory accurate.</p>
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
                                  <Label htmlFor="name" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Name
                                  </Label>
                                  <Input id="name" defaultValue={product.name} className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="sku" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    SKU
                                  </Label>
                                  <Input id="sku" defaultValue={product.sku} className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="category" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Folder className="h-4 w-4" />
                                    Category
                                  </Label>
                                  <Input id="category" defaultValue={product.category} className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="subcategory" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4" />
                                    Subcategory
                                  </Label>
                                  <Input id="subcategory" defaultValue={product.subcategory} className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="brand" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Brand
                                  </Label>
                                  <Input id="brand" defaultValue={product.brand} className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="status" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Circle className="h-4 w-4" />
                                    Status
                                  </Label>
                                  <Select defaultValue={product.status}>
                                    <SelectTrigger className="h-10 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="low">Low Stock</SelectItem>
                                      <SelectItem value="out">Out of Stock</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Pricing & Stock Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Pricing & Inventory
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="price" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Price ($)
                                  </Label>
                                  <Input id="price" defaultValue={product.price.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="costPrice" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Cost Price ($)
                                  </Label>
                                  <Input id="costPrice" defaultValue={product.costPrice.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="stock" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <PackageCheck className="h-4 w-4" />
                                    Stock
                                  </Label>
                                  <Input id="stock" defaultValue={product.stock} type="number" className="h-10 text-sm" />
                                </div>
                              </div>
                            </div>

                            {/* Physical Details Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Scale className="h-4 w-4" />
                                Physical Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="weight" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Scale className="h-4 w-4" />
                                    Weight (g)
                                  </Label>
                                  <Input id="weight" defaultValue={product.weight.replace('g', '').replace('kg', ' * 1000')} type="number" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="dimensions" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Ruler className="h-4 w-4" />
                                    Dimensions (cm)
                                  </Label>
                                  <Input id="dimensions" defaultValue={product.dimensions} placeholder="L x W x H" className="h-10 text-sm" />
                                </div>
                              </div>
                            </div>

                            {/* Description & Specs */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Description
                                </Label>
                                <Textarea id="description" defaultValue={product.description} className="min-h-[100px] resize-none text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="specifications" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <ListOrdered className="h-4 w-4" />
                                  Specifications
                                </Label>
                                <Textarea id="specifications" defaultValue={product.specifications} className="min-h-[100px] resize-none text-sm" />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                              <Button className="flex-1 h-10 sm:h-auto bg-primary hover:bg-primary/90">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button variant="outline" className="flex-1 h-10 sm:h-auto">
                                <X className="h-4 w-4 mr-2" />
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
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}