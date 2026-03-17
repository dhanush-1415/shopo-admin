// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Save, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ProductForm from '@/components/Product/ProductForm';
import ProductTable from '@/components/Product/ProductTable';
import ProductViewer from '@/components/Product/ProductViewer';
import { getAllProducts, getProductById } from '@/api/services/productService';
import { useAuthStore } from '@/store/authStore';

export default function Products() {
  const { getToken } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await getAllProducts(token);

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.error || 'Failed to load products');
        toast.error(response.error || 'Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSave = (data) => {
    console.log('Product created:', data);
    // Refresh product list after creation
    fetchProducts();
    setIsCreateOpen(false);
  };

  const handleEditSave = (data) => {
    console.log('Product updated:', data);
    alert('Product updated successfully!');
    setIsEditOpen(false);
    setSelectedProduct(null);
  };

  const handleView = async (product) => {
    setIsViewOpen(true);
    setIsLoadingProduct(true);
    try {
      const token = getToken();
      const response = await getProductById(product.id || product._original?.id, token);
      
      if (response.success) {
        setSelectedProduct(response.data);
      } else {
        toast.error(response.error || 'Failed to load product details');
        // Fallback to the product from list if API fails
        setSelectedProduct(product);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load product details');
      // Fallback to the product from list if API fails
      setSelectedProduct(product);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleEdit = async (product) => {
    setIsEditOpen(true);
    setIsLoadingProduct(true);
    try {
      const token = getToken();
      const response = await getProductById(product.id || product._original?.id, token);
      
      if (response.success) {
        setSelectedProduct(response.data);
      } else {
        toast.error(response.error || 'Failed to load product details');
        // Fallback to the product from list if API fails
        setSelectedProduct(product);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load product details');
      // Fallback to the product from list if API fails
      setSelectedProduct(product);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const exportToPDF = async () => {
    // PDF export is handled in ProductTable component
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchProducts}
            disabled={isLoading}
            title="Refresh products"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
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
      </div>

      <ProductTable 
        products={products}
        isLoading={isLoading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onExport={exportToPDF}
        onRefresh={fetchProducts}
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          {isLoadingProduct ? (
            <div className="flex items-center justify-center h-[90vh]">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          ) : selectedProduct ? (
            <ProductViewer product={selectedProduct} onEdit={handleEdit} />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          {isLoadingProduct ? (
            <div className="flex items-center justify-center h-[90vh]">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          ) : selectedProduct ? (
            <ProductForm 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)}
            mode="edit"
            initialData={selectedProduct}
            onSave={handleEditSave}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}