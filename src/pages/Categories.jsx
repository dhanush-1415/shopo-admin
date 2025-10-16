import { useState } from "react";
import { Plus, FolderTree, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    productCount: 145,
    subcategories: [
      { id: 101, name: "Smartphones", productCount: 45 },
      { id: 102, name: "Laptops", productCount: 32 },
      { id: 103, name: "Tablets", productCount: 28 },
      { id: 104, name: "Audio Devices", productCount: 40 },
    ]
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories",
    productCount: 289,
    subcategories: [
      { id: 201, name: "Men's Clothing", productCount: 98 },
      { id: 202, name: "Women's Clothing", productCount: 124 },
      { id: 203, name: "Shoes", productCount: 45 },
      { id: 204, name: "Accessories", productCount: 22 },
    ]
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture and home decor",
    productCount: 156,
    subcategories: [
      { id: 301, name: "Furniture", productCount: 67 },
      { id: 302, name: "Decor", productCount: 45 },
      { id: 303, name: "Kitchen", productCount: 44 },
    ]
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Cosmetics and personal care products",
    productCount: 234,
    subcategories: [
      { id: 401, name: "Skincare", productCount: 89 },
      { id: 402, name: "Makeup", productCount: 78 },
      { id: 403, name: "Haircare", productCount: 45 },
      { id: 404, name: "Fragrances", productCount: 22 },
    ]
  },
];

export default function Categories() {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateSubcategoryOpen, setIsCreateSubcategoryOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into categories</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateSubcategoryOpen} onOpenChange={setIsCreateSubcategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-category">Parent Category</Label>
                  <Select>
                    <SelectTrigger id="parent-category">
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input id="subcategory-name" placeholder="e.g., Smartphones" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-slug">Slug</Label>
                  <Input id="subcategory-slug" placeholder="e.g., smartphones" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateSubcategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Create Subcategory</Button>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" placeholder="e.g., Electronics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-slug">Slug</Label>
                  <Input id="category-slug" placeholder="e.g., electronics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    placeholder="Brief description of the category"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Create Category</Button>
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
            <p className="text-xs text-muted-foreground">Across all categories</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fashion</div>
            <p className="text-xs text-muted-foreground">289 products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderTree className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Total Products</span>
                  <Badge className="bg-primary hover:bg-primary/90">{category.productCount}</Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Subcategories ({category.subcategories.length})
                  </h4>
                  <div className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-2 rounded border hover:bg-accent transition-colors"
                      >
                        <span className="text-sm">{subcategory.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {subcategory.productCount} items
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}