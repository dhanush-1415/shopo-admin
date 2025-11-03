
import React, { useState } from "react";
import { Plus, FolderTree, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

const categories = [
  {
    id: 1,
    name: "Topwear",
    slug: "topwear",
    description: "Upper body clothing including t-shirts, shirts, sweatshirts, jackets, and ethnic tops",
    productCount: 450,
    subcategories: [
      {
        id: 101,
        name: "T-Shirts",
        productCount: 180,
        childSubcategories: [
          { id: 1011, name: "Plain / Basic T-Shirts", productCount: 50 },
          { id: 1012, name: "Graphic / Printed T-Shirts", productCount: 40 },
          { id: 1013, name: "Polo T-Shirts", productCount: 30 },
          { id: 1014, name: "Oversized / Relaxed Fit T-Shirts", productCount: 25 },
          { id: 1015, name: "Tank / Sleeveless Tops", productCount: 20 },
          { id: 1016, name: "Long-Sleeve Tees", productCount: 15 },
        ]
      },
      {
        id: 102,
        name: "Shirts",
        productCount: 120,
        childSubcategories: [
          { id: 1021, name: "Formal / Office Shirts", productCount: 25 },
          { id: 1022, name: "Casual Shirts", productCount: 30 },
          { id: 1023, name: "Designer / Premium Shirts", productCount: 20 },
          { id: 1024, name: "Linen / Breathable Fabric Shirts", productCount: 15 },
          { id: 1025, name: "Half‐Sleeve Shirts", productCount: 15 },
          { id: 1026, name: "Check / Printed / Patterned Shirts", productCount: 15 },
        ]
      },
      {
        id: 103,
        name: "Sweatshirts / Hoodies / Pullovers",
        productCount: 65,
        childSubcategories: [
          { id: 1031, name: "Hooded Sweatshirts", productCount: 25 },
          { id: 1032, name: "Crew-Neck Sweatshirts", productCount: 20 },
          { id: 1033, name: "Zip & Half-Zip Sweatshirts", productCount: 20 },
        ]
      },
      {
        id: 104,
        name: "Jackets & Outerwear",
        productCount: 55,
        childSubcategories: [
          { id: 1041, name: "Light Jackets (Bomber, Windbreaker, etc)", productCount: 15 },
          { id: 1042, name: "Denim Jackets", productCount: 15 },
          { id: 1043, name: "Leather / Faux-Leather Jackets", productCount: 10 },
          { id: 1044, name: "Parkas / Winter Coats", productCount: 10 },
          { id: 1045, name: "Blazers & Sport Coats (if applicable)", productCount: 5 },
        ]
      },
      {
        id: 105,
        name: "Ethnic / Traditional Tops (if you carry)",
        productCount: 30,
        childSubcategories: [
          { id: 1051, name: "Kurta / Ethnic Shirts", productCount: 20 },
          { id: 1052, name: "Nehru / Mandarins / Band-Collar Shirts", productCount: 10 },
        ]
      },
    ]
  },
  {
    id: 2,
    name: "Bottomwear",
    slug: "bottomwear",
    description: "Lower body clothing including jeans, trousers, shorts, and joggers",
    productCount: 320,
    subcategories: [
      {
        id: 201,
        name: "Jeans",
        productCount: 120,
        childSubcategories: [
          { id: 2011, name: "Slim Fit Jeans", productCount: 30 },
          { id: 2012, name: "Straight Fit Jeans", productCount: 25 },
          { id: 2013, name: "Relaxed / Loose Fit Jeans", productCount: 20 },
          { id: 2014, name: "Distressed / Washed Jeans", productCount: 25 },
          { id: 2015, name: "Ankle Fit / Tapered", productCount: 20 },
        ]
      },
      {
        id: 202,
        name: "Trousers & Chinos",
        productCount: 85,
        childSubcategories: [
          { id: 2021, name: "Chino Pants", productCount: 25 },
          { id: 2022, name: "Linen Trousers", productCount: 15 },
          { id: 2023, name: "Corduroy Pants", productCount: 15 },
          { id: 2024, name: "Formal Trousers", productCount: 20 },
          { id: 2025, name: "Gurkha / Pleated styles", productCount: 10 },
        ]
      },
      {
        id: 203,
        name: "Shorts",
        productCount: 60,
        childSubcategories: [
          { id: 2031, name: "Casual Shorts", productCount: 20 },
          { id: 2032, name: "Cargo Shorts", productCount: 15 },
          { id: 2033, name: "Linen Shorts", productCount: 10 },
          { id: 2034, name: "Knee-length / above-knee", productCount: 15 },
        ]
      },
      {
        id: 204,
        name: "Joggers / Sweatpants",
        productCount: 55,
        childSubcategories: [
          { id: 2041, name: "Regular Joggers", productCount: 25 },
          { id: 2042, name: "Cargo Joggers", productCount: 15 },
          { id: 2043, name: "Lounge / Athleisure Pants", productCount: 15 },
        ]
      },
    ]
  },
  {
    id: 3,
    name: "Underwear, Loungewear & Nightwear",
    slug: "underwear-loungewear-nightwear",
    description: "Innerwear, comfortable home and sleep clothing",
    productCount: 180,
    subcategories: [
      {
        id: 301,
        name: "Underwear",
        productCount: 70,
        childSubcategories: [
          { id: 3011, name: "Briefs / Boxers / Boxer-Briefs", productCount: 40 },
          { id: 3012, name: "Trunks", productCount: 30 },
        ]
      },
      {
        id: 302,
        name: "Loungewear / Homewear",
        productCount: 60,
        childSubcategories: [
          { id: 3021, name: "Lounge Pants", productCount: 20 },
          { id: 3022, name: "Shorts", productCount: 15 },
          { id: 3023, name: "Lounge Shirts / Tees", productCount: 25 },
        ]
      },
      {
        id: 303,
        name: "Nightwear",
        productCount: 50,
        childSubcategories: [
          { id: 3031, name: "Pyjamas", productCount: 30 },
          { id: 3032, name: "Night Tees", productCount: 20 },
        ]
      },
    ]
  },
  {
    id: 4,
    name: "Activewear / Sportswear",
    slug: "activewear-sportswear",
    description: "Performance and gym clothing for active lifestyles",
    productCount: 210,
    subcategories: [
      { id: 401, name: "Active T-Shirts / Tees", productCount: 50 },
      { id: 402, name: "Track Pants / Sweat Pants", productCount: 45 },
      { id: 403, name: "Gym Shorts", productCount: 40 },
      { id: 404, name: "Hoodie / Sweatshirt (sports)", productCount: 35 },
      { id: 405, name: "Jacket / Windbreaker (sports)", productCount: 40 },
    ]
  },
  {
    id: 5,
    name: "Accessories",
    slug: "accessories",
    description: "Essential add-ons like sunglasses, socks, and scarves",
    productCount: 120,
    subcategories: [
      { id: 501, name: "Sunglasses", productCount: 25 },
      { id: 502, name: "Scarves / Mufflers", productCount: 20 },
      { id: 503, name: "Socks", productCount: 35 },
      { id: 504, name: "Towels", productCount: 20 },
      { id: 505, name: "Belts", productCount: 20 },
    ]
  },
  {
    id: 6,
    name: "Seasonal / Special Collections",
    slug: "seasonal-special-collections",
    description: "Limited edition and seasonal drops including winter wear and festive collections",
    productCount: 150,
    subcategories: [
      { id: 601, name: "Winter Wear (e.g., Sweaters, Coats, Thermal Layers)", productCount: 45 },
      { id: 602, name: "Summer Essentials (e.g., Linen, Shorts)", productCount: 40 },
      { id: 603, name: "Festive / Designer Drop", productCount: 35 },
      { id: 604, name: "Co-ords / Matching Sets", productCount: 30 },
    ]
  },
  {
    id: 7,
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest products added to the collection",
    productCount: 80,
    subcategories: [
      { id: 701, name: "Topwear New", productCount: 30 },
      { id: 702, name: "Bottomwear New", productCount: 25 },
      { id: 703, name: "Accessories New", productCount: 25 },
    ]
  },
  {
    id: 8,
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Top performing products based on sales",
    productCount: 100,
    subcategories: [
      { id: 801, name: "Topwear Bestsellers", productCount: 40 },
      { id: 802, name: "Bottomwear Bestsellers", productCount: 35 },
      { id: 803, name: "Activewear Bestsellers", productCount: 25 },
    ]
  },
  {
    id: 9,
    name: "Sale / Clearance",
    slug: "sale-clearance",
    description: "Discounted items and clearance products",
    productCount: 200,
    subcategories: [
      { id: 901, name: "Topwear Sale", productCount: 70 },
      { id: 902, name: "Bottomwear Sale", productCount: 60 },
      { id: 903, name: "Accessories Sale", productCount: 70 },
    ]
  },
  {
    id: 10,
    name: "Trending Now",
    slug: "trending-now",
    description: "Currently popular and trending items",
    productCount: 90,
    subcategories: [
      { id: 1001, name: "Topwear Trending", productCount: 35 },
      { id: 1002, name: "Activewear Trending", productCount: 30 },
      { id: 1003, name: "Seasonal Trending", productCount: 25 },
    ]
  },
];

export default function Categories() {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateSubcategoryOpen, setIsCreateSubcategoryOpen] = useState(false);
  const [isCreateChildSubcategoryOpen, setIsCreateChildSubcategoryOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());

  // Flatten subcategories for select options
  const allSubcategories = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      id: sub.id,
      name: `${cat.name} > ${sub.name}`,
      slug: sub.slug || `${cat.slug}-${sub.name.toLowerCase().replace(/\s+/g, '-')}`,
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
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  <Select>
                    <SelectTrigger id="parent-subcategory">
                      <SelectValue placeholder="Select parent subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-subcategory-name">Child Subcategory Name</Label>
                  <Input id="child-subcategory-name" placeholder="e.g., Slim Fit Jeans" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateChildSubcategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Create Child Subcategory</Button>
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
                  <Input id="subcategory-name" placeholder="e.g., Plain / Basic T-Shirts" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" placeholder="e.g., Topwear" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    placeholder="Brief description of the category, e.g., Upper body clothing including t-shirts and shirts"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
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
    </div>
  );
}