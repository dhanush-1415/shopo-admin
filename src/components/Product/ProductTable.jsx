// src/components/Product/ProductTable.jsx
import { useState, useMemo } from "react";
import { Search, Download, Filter, Eye, Edit, MoreVertical, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import { API_CONFIG } from '@/api/config';

// Apply the plugin once at module level to add autoTable to jsPDF prototype
applyPlugin(jsPDF);

// Transform API product data to match component expectations
const transformProduct = (apiProduct) => {
  // Calculate total stock from inventories array
  const totalStock = apiProduct.inventories?.reduce((sum, inv) => sum + (inv.availableQuantity || 0), 0) || 0;
  
  // Get category names (lowercase keys in API response)
  const categoryName = apiProduct.category?.name || 'N/A';
  const subCategoryName = apiProduct.subCategory?.name || 'N/A';
  const childCategoryName = apiProduct.childCategory?.name || null;
  
  // Get image URL (can be full URL or relative path)
  const imageUrl = apiProduct.thumbnailImage 
    ? (apiProduct.thumbnailImage.startsWith('http') 
        ? apiProduct.thumbnailImage 
        : `${API_CONFIG.BASE_URL}/${apiProduct.thumbnailImage}`)
    : null;

  // Transform inventories to variations format
  const variations = apiProduct.inventories?.map(inv => {
    const color = inv.productColor?.color || 'N/A';
    const sizes = Array.isArray(inv.productSize?.size) 
      ? inv.productSize.size 
      : (inv.productSize?.size ? [inv.productSize.size] : []);
    
    // Create a variation for each size
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
    images: imageUrl || '',
    material: apiProduct.productMaterialId || 'N/A',
    fitType: apiProduct.fitType || 'N/A',
    occasion: apiProduct.occasion?.name || 'N/A',
    seasonal: apiProduct.seasonal || 'N/A',
    careInstructions: apiProduct.careInstructions || '',
    metaKeywords: apiProduct.metaTitle || '',
    metaDescription: apiProduct.metaDescription || '',
    variations: variations,
    gst: apiProduct.gst || 0,
    status: apiProduct.status || 'active',
    // Keep original API data for reference
    _original: apiProduct,
  };
};

const ProductTable = ({ products = [], isLoading = false, error = null, onView, onEdit, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Transform API products
  const transformedProducts = useMemo(() => {
    return products.map(transformProduct);
  }, [products]);

  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    return ['all', ...new Set(transformedProducts.map(product => product.category))];
  }, [transformedProducts]);

  const filteredProducts = useMemo(() => {
    return transformedProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = stockFilter === 'all' ||
                           (stockFilter === 'in-stock' && product.stockQty > 0) ||
                           (stockFilter === 'out-of-stock' && product.stockQty === 0);
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [transformedProducts, searchQuery, stockFilter, categoryFilter]);

  // Enhanced PDF Export function for all products data with professional design
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for better table fit
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Stylish header with title, date, and company info (customize as needed)
      doc.setFillColor(41, 128, 185); // Blue theme
      doc.rect(0, 0, pageWidth, 30, 'F'); // Header background
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Products Inventory Report', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 25, { align: 'center' });

      // Table configuration with enhanced styling
      const headers = [['Product Title', 'Category', 'Selling Price', 'Stock Quantity']];

      // Prepare all products data (unfiltered for full export)
      const body = transformedProducts.map(product => [
        product.title,
        product.category,
        product.sellingPrice, // Already formatted with ₹
        product.stockQty.toString()
      ]);

      // Generate professional table (removed await as it's synchronous)
      doc.autoTable({
        head: headers,
        body: body,
        startY: 40,
        theme: 'grid',
        styles: { 
          fontSize: 9, 
          cellPadding: 5, 
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [200, 200, 200]
        },
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11,
          lineWidth: 0.5
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 100, halign: 'left' }, // Wider for title
          1: { cellWidth: 60 },
          2: { cellWidth: 50, halign: 'right' },
          3: { cellWidth: 40, halign: 'center' }
        },
        margin: { top: 40, left: 15, right: 15, bottom: 20 },
        didDrawPage: (data) => {
          // Page footer with page numbers and totals
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.setFont('helvetica', 'italic');
          const pageCount = doc.internal.getNumberOfPages();
                 doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                 doc.text(`Total Products: ${transformedProducts.length} | Total Stock: ${transformedProducts.reduce((sum, p) => sum + p.stockQty, 0)}`, 15, pageHeight - 10);
        }
      });

      // Summary section if space allows
      const finalY = doc.lastAutoTable.finalY + 15;
      if (finalY < pageHeight - 40) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', 15, finalY);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Total Items: ${products.length}`, 15, finalY + 8);
        const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
        doc.text(`• Total Stock Quantity: ${totalStock}`, 15, finalY + 16);
        const totalValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.stockQty), 0);
        doc.text(`• Estimated Inventory Value: $${totalValue.toLocaleString()}`, 15, finalY + 24);
      }

      // Save with timestamped filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      doc.save(`products-inventory-report-${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      // Optionally integrate with toast notification here
      alert(`Failed to generate PDF: ${error.message}. Please check console for details.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-auto"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 sm:h-auto w-[160px]">
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="h-10 sm:h-auto w-[140px]">
                <SelectValue placeholder="Filter Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-auto flex items-center gap-2"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
        {/* Optional: Show filtered count for better UX */}
        {filteredProducts.length !== transformedProducts.length && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredProducts.length} of {transformedProducts.length} products
          </p>
        )}
      </Card>

      {isLoading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-destructive">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] text-left">Product</TableHead>
                <TableHead className="text-left sm:text-center">Category</TableHead>
                <TableHead className="text-left sm:text-center">Selling Price</TableHead>
                <TableHead className="text-left sm:text-center">Stock</TableHead>
                <TableHead className="text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50 border-b">
                  <TableCell className="font-medium max-w-[200px] truncate" title={product.title}>
                    {product.title}
                  </TableCell>
                  <TableCell className="text-left sm:text-center">{product.category}</TableCell>
                  <TableCell className="font-semibold text-left sm:text-center">{product.sellingPrice}</TableCell>
                  <TableCell className="text-left sm:text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stockQty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQty}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary/5"
                        onClick={() => onView(product)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary/5"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary/5" title="More Actions">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => {/* Handle View Orders */}}>
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {/* Handle Duplicate */}}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => {/* Handle Delete */}}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {transformedProducts.length === 0 
                      ? 'No products found. Create your first product!' 
                      : 'No products found matching your filters.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default ProductTable;