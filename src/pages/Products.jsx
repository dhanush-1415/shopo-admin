// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ProductForm from '@/components/Product/ProductForm';
import ProductTable from '@/components/Product/ProductTable';
import ProductViewer from '@/components/Product/ProductViewer';
import { products } from '@/components/Product/productsData';

export default function Products() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCreateSave = (data) => {
    console.log('Product created:', data);
    alert('Product created successfully!');
    setIsCreateOpen(false);
  };

  const handleEditSave = (data) => {
    console.log('Product updated:', data);
    alert('Product updated successfully!');
    setIsEditOpen(false);
    setSelectedProduct(null);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let yPos = 20;

      doc.setFontSize(16);
      doc.text('Products Export', 20, yPos);
      yPos += 20;

      products.forEach((product, index) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${product.title}`, 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Category: ${product.category} > ${product.subCategory} ${product.childCategory ? `> ${product.childCategory}` : ''}`, 30, yPos);
        yPos += 5;
        doc.text(`Description: ${product.description}`, 30, yPos);
        yPos += 5;
        doc.text(`Material: ${product.material} | Fit: ${product.fitType} | Occasion: ${product.occasion}`, 30, yPos);
        yPos += 5;
        doc.text(`Color: ${product.color} | Sizes: ${product.sizes}`, 30, yPos);
        yPos += 5;
        doc.text(`MRP: ${product.mrp} | Selling Price: ${product.sellingPrice} | Stock: ${product.stockQty}`, 30, yPos);
        yPos += 5;
        doc.text(`Care: ${product.careInstructions}`, 30, yPos);
        yPos += 5;
        doc.text(`Meta Keywords: ${product.metaKeywords}`, 30, yPos);
        yPos += 5;
        doc.text(`Meta Description: ${product.metaDescription}`, 30, yPos);
        yPos += 10;
      });

      doc.save('products-export.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 px-4 sm:px-6 h-10 sm:h-auto">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
            <ProductForm 
              isOpen={isCreateOpen} 
              onClose={() => setIsCreateOpen(false)}
              mode="create"
              onSave={handleCreateSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProductTable 
        onView={handleView}
        onEdit={handleEdit}
        onExport={exportToPDF}
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          {selectedProduct && <ProductViewer product={selectedProduct} onEdit={handleEdit} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          {selectedProduct && <ProductForm 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)}
            mode="edit"
            initialData={selectedProduct}
            onSave={handleEditSave}
          />}
        </DialogContent>
      </Dialog>
    </div>
  );
}