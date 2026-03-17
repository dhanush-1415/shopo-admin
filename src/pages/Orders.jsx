import { useState, useEffect } from "react";
import { Search, MoreVertical, Eye, Download, MapPin, Phone, Mail, Package, Edit, Trash2, DollarSign, CreditCard, FileText, Save, X, Hash, Award, Circle, ListOrdered, Scale, Ruler, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getAllOrders } from '@/api/services/orderService';
import { useAuthStore } from '@/store/authStore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label';

// Transform API order data to UI format
const transformOrder = (apiOrder) => {
  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `₹${amount.toFixed(2)}`;
    }
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatOrderId = (id) => {
    if (!id) return '#ORD-000';
    // Use first 8 characters of UUID for display
    const shortId = id.substring(0, 8).toUpperCase();
    return `#ORD-${shortId}`;
  };

  const customer = apiOrder.Customer || {};
  const orderItems = apiOrder.OrderItems || [];

  // Build full address from customer details
  const addressParts = [
    apiOrder.shippingAddress || customer.address,
    customer.city,
    customer.state,
    customer.country,
    customer.postalCode
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  // Transform order items
  const items = orderItems.map(item => ({
    name: item.productName || item.Product?.name || 'Unknown Product',
    qty: item.quantity || 0,
    price: formatCurrency(item.unitPrice || item.totalPrice || 0),
    productId: item.productId,
    productColorId: item.productColorId,
    productSizeId: item.productSizeId,
  }));

  return {
    id: formatOrderId(apiOrder.id),
    originalId: apiOrder.id,
    customer: customer.name || 'Unknown Customer',
    email: customer.email || '',
    phone: customer.phone || '',
    date: formatDate(apiOrder.createdAt),
    total: formatCurrency(apiOrder.finalAmount || apiOrder.totalAmount || 0),
    subtotal: formatCurrency(apiOrder.subTotal || 0),
    tax: formatCurrency(apiOrder.tax || 0),
    shipping: formatCurrency(apiOrder.shippingCharge || 0),
    status: apiOrder.status || 'pending',
    payment: apiOrder.paymentMethod || 'Unknown',
    paymentStatus: apiOrder.paymentStatus || 'pending',
    address: fullAddress || 'No address provided',
    orderNote: apiOrder.orderNote || '',
    totalItems: apiOrder.totalItems || 0,
    items: items,
    // Keep original data for edit functionality
    originalData: apiOrder,
  };
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'default';
    case 'shipped':
      return 'secondary';
    case 'processing':
      return 'secondary';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  return status === 'delivered' ? 'Delivered' :
         status === 'shipped' ? 'Shipped' :
         status === 'processing' ? 'Processing' :
         status === 'pending' ? 'Pending' :
         'Cancelled';
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getToken } = useAuthStore();

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        toast.error('Please login to view orders');
        setIsLoading(false);
        return;
      }

      const response = await getAllOrders(token);
      
      if (response.success) {
        // Transform API orders to UI format
        const transformedOrders = (response.data || []).map(transformOrder);
        setOrders(transformedOrders);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch orders');
        toast.error(response.error || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
      fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.phone.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchOrders}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchOrders} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Order ID</TableHead>
                <TableHead className="text-center">Customer</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {searchQuery ? `No orders found matching "${searchQuery}"` : 'No orders found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-center font-medium">{order.id}</TableCell>
                <TableCell className="text-center">{order.customer}</TableCell>
                <TableCell className="text-center text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-center font-semibold">{order.total}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{order.payment}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
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
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                        <DialogHeader className="p-6 border-b">
                          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Details - {order.id}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto space-y-6">
                          {/* Order Header */}
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                              <div className="flex-shrink-0 mb-4 md:mb-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                                  <Package className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                <h2 className="text-xl md:text-2xl font-bold">Order #{order.id}</h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Order placed on {order.date}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs md:text-sm font-medium">Customer:</span>
                                  <Badge variant="outline" className="text-xs md:text-sm">{order.customer}</Badge>
                                </div>
                                <Badge
                                  variant={getStatusColor(order.status)}
                                  className="text-xs md:text-sm mt-2"
                                >
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </div>
                            </div>
                          </Card>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Total</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold text-primary">{order.total}</p>
                              <p className="text-xs text-muted-foreground">final amount</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Subtotal</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{order.subtotal}</p>
                              <p className="text-xs text-muted-foreground">before taxes</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Package className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Items</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
                              <p className="text-xs text-muted-foreground">total quantity</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Payment</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{order.payment}</p>
                              <p className="text-xs text-muted-foreground">method</p>
                            </Card>
                          </div>

                          {/* Order Information */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Basic Information
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Order ID</p>
                                  <p className="font-mono font-medium text-sm md:text-base">{order.id}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Date</p>
                                  <p className="font-medium text-sm md:text-base">{order.date}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Payment</p>
                                  <p className="font-medium text-sm md:text-base">{order.payment}</p>
                                </div>
                              </Card>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Shipping Details
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Address</p>
                                  <p className="font-medium text-sm md:text-base leading-relaxed">{order.address}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                                  <Badge variant={getStatusColor(order.status)} className="text-xs md:text-sm">
                                    {getStatusLabel(order.status)}
                                  </Badge>
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Customer Information
                            </h3>
                            <Card className="p-4 md:p-6 space-y-4">
                              <div className="space-y-2">
                                <p className="text-xs md:text-sm text-muted-foreground">Name</p>
                                <p className="font-medium text-sm md:text-base">{order.customer}</p>
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                                <p className="font-medium text-sm md:text-base">{order.email}</p>
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium text-sm md:text-base">{order.phone}</p>
                              </div>
                            </Card>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <ListOrdered className="h-4 w-4" />
                              Order Items
                            </h3>
                            <Card className="p-4 md:p-6">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-center">{item.qty}</TableCell>
                                        <TableCell className="text-right">{item.price}</TableCell>
                                      </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Card>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Order Summary
                            </h3>
                            <Card className="p-4 md:p-6">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>{order.tax}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span>{order.shipping}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total</span>
                                  <span className="text-primary">{order.total}</span>
                                </div>
                              </div>
                            </Card>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                            <Button variant="secondary" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Update Order
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
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                        <DialogHeader className="px-6 py-4 border-b">
                          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit Order - {order.id}
                          </DialogTitle>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">Update order details to keep your records accurate.</p>
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
                                <Label htmlFor="customer" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Customer
                                </Label>
                                <Input id="customer" defaultValue={order.customer} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="orderId" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Hash className="h-4 w-4" />
                                  Order ID
                                </Label>
                                <Input id="orderId" defaultValue={order.id} disabled className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Date
                                </Label>
                                <Input id="date" defaultValue={order.date} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Circle className="h-4 w-4" />
                                  Status
                                </Label>
                                <Select defaultValue={order.status}>
                                  <SelectTrigger className="h-10 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & Summary Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Pricing & Summary
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="subtotal" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  Subtotal ($)
                                </Label>
                                <Input id="subtotal" defaultValue={order.subtotal.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tax" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Tax ($)
                                </Label>
                                <Input id="tax" defaultValue={order.tax.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="shipping" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  Shipping ($)
                                </Label>
                                <Input id="shipping" defaultValue={order.shipping.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="total" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  Total ($)
                                </Label>
                                <Input id="total" defaultValue={order.total.replace('$', '')} type="number" step="0.01" className="h-10 text-sm" />
                              </div>
                            </div>
                          </div>

                          {/* Customer Details Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Customer Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email
                                </Label>
                                <Input id="email" defaultValue={order.email} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone
                                </Label>
                                <Input id="phone" defaultValue={order.phone} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="payment" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Payment Method
                                </Label>
                                <Select defaultValue={order.payment}>
                                  <SelectTrigger className="h-10 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                                    <SelectItem value="COD">COD</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Address Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Shipping Address
                            </h3>
                            <div className="space-y-2">
                              <Label htmlFor="address" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Address
                              </Label>
                              <Textarea id="address" defaultValue={order.address} className="min-h-[100px] resize-none text-sm" />
                            </div>
                          </div>

                          {/* Order Items Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <ListOrdered className="h-4 w-4" />
                              Order Items
                            </h3>
                            <Card className="p-4 md:p-6">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-medium">
                                        <Input defaultValue={item.name} className="h-8 text-sm" />
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Input defaultValue={item.qty} type="number" className="w-16 h-8 text-sm mx-auto" />
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Input defaultValue={item.price.replace('$', '')} type="number" step="0.01" className="w-24 h-8 text-sm text-right" />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Card>
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
                        <Button variant="ghost" size="sm">
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
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}