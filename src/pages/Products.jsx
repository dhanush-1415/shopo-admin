import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Package, DollarSign, Tag } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Product</TableHead>
              <TableHead className="text-center">SKU</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-center font-medium">{product.name}</TableCell>
                <TableCell className="text-center text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-center">{product.category}</TableCell>
                <TableCell className="text-center font-semibold">{product.price}</TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      product.status === 'active'
                        ? 'default'
                        : product.status === 'low'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {product.status === 'active' ? 'In Stock' : product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full h-full max-w-none max-h-none overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            Product Details
                          </DialogTitle>

                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          {/* Product Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-bold">{product.name}</h2>
                              <p className="text-muted-foreground mt-1">{product.description}</p>
                            </div>
                            <Badge
                              variant={
                                product.status === 'active'
                                  ? 'default'
                                  : product.status === 'low'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {product.status === 'active' ? 'In Stock' : product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                            </Badge>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <Card className="p-4">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Price</span>
                              </div>
                              <p className="text-2xl font-bold text-primary">{product.price}</p>
                              <p className="text-xs text-muted-foreground">Cost: {product.costPrice}</p>
                            </Card>
                            <Card className="p-4">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Package className="h-4 w-4" />
                                <span className="text-sm">Stock</span>
                              </div>
                              <p className="text-2xl font-bold">{product.stock}</p>
                              <p className="text-xs text-muted-foreground">units available</p>
                            </Card>
                            <Card className="p-4">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Tag className="h-4 w-4" />
                                <span className="text-sm">Sold</span>
                              </div>
                              <p className="text-2xl font-bold">{product.sold}</p>
                              <p className="text-xs text-muted-foreground">total units</p>
                            </Card>
                          </div>

                          {/* Product Information */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3">Basic Information</h3>
                              <Card className="p-4 space-y-3">
                                <div>
                                  <p className="text-sm text-muted-foreground">SKU</p>
                                  <p className="font-mono font-medium">{product.sku}</p>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground">Category</p>
                                  <p className="font-medium">{product.category}</p>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground">Subcategory</p>
                                  <p className="font-medium">{product.subcategory}</p>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground">Brand</p>
                                  <p className="font-medium">{product.brand}</p>
                                </div>
                              </Card>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-3">Physical Details</h3>
                              <Card className="p-4 space-y-3">
                                <div>
                                  <p className="text-sm text-muted-foreground">Weight</p>
                                  <p className="font-medium">{product.weight}</p>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-sm text-muted-foreground">Dimensions</p>
                                  <p className="font-medium">{product.dimensions}</p>
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Specifications */}
                          <div>
                            <h3 className="font-semibold mb-3">Specifications</h3>
                            <Card className="p-4">
                              <p className="text-sm">{product.specifications}</p>
                            </Card>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </Button>
                            <Button variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Product
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full h-full max-w-none max-h-none overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <DialogHeader>
                          <DialogTitle>Edit Product - {product.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          {/* Edit Form */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Name</label>
                              <Input defaultValue={product.name} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">SKU</label>
                              <Input defaultValue={product.sku} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Category</label>
                              <Input defaultValue={product.category} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Subcategory</label>
                              <Input defaultValue={product.subcategory} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Price</label>
                              <Input defaultValue={product.price} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Cost Price</label>
                              <Input defaultValue={product.costPrice} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Stock</label>
                              <Input defaultValue={product.stock} type="number" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <select className="w-full p-2 border rounded" defaultValue={product.status}>
                                <option value="active">Active</option>
                                <option value="low">Low Stock</option>
                                <option value="out">Out of Stock</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Brand</label>
                              <Input defaultValue={product.brand} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Weight</label>
                              <Input defaultValue={product.weight} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                              <Input defaultValue={product.dimensions} />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <textarea className="w-full p-2 border rounded" rows="3" defaultValue={product.description}></textarea>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Specifications</label>
                            <textarea className="w-full p-2 border rounded" rows="3" defaultValue={product.specifications}></textarea>
                          </div>
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              Save Changes
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}