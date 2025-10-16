import { useState } from "react";
import { Search, MoreVertical, Eye, Download, MapPin, Phone, Mail, Package, Edit, Trash2 } from 'lucide-react';
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

const orders = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    date: '2024-01-15',
    total: '$299.00',
    subtotal: '$249.00',
    tax: '$25.00',
    shipping: '$25.00',
    status: 'delivered',
    payment: 'Prepaid',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    items: [
      { name: 'Premium Headphones', qty: 1, price: '$249.00' },
    ]
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 891',
    date: '2024-01-16',
    total: '$149.00',
    subtotal: '$129.00',
    tax: '$13.00',
    shipping: '$7.00',
    status: 'processing',
    payment: 'COD',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    items: [
      { name: 'Wireless Mouse', qty: 2, price: '$98.00' },
      { name: 'Mouse Pad', qty: 1, price: '$31.00' },
    ]
  },
  {
    id: '#ORD-003',
    customer: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1 234 567 892',
    date: '2024-01-17',
    total: '$499.00',
    subtotal: '$449.00',
    tax: '$45.00',
    shipping: '$5.00',
    status: 'shipped',
    payment: 'Prepaid',
    address: '789 Pine Road, Chicago, IL 60601',
    items: [
      { name: 'Gaming Monitor', qty: 1, price: '$449.00' },
    ]
  },
  {
    id: '#ORD-004',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 234 567 893',
    date: '2024-01-18',
    total: '$79.00',
    subtotal: '$70.00',
    tax: '$7.00',
    shipping: '$2.00',
    status: 'pending',
    payment: 'Prepaid',
    address: '321 Elm Street, Houston, TX 77001',
    items: [
      { name: 'USB-C Hub', qty: 1, price: '$70.00' },
    ]
  },
  {
    id: '#ORD-005',
    customer: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '+1 234 567 894',
    date: '2024-01-19',
    total: '$199.00',
    subtotal: '$169.00',
    tax: '$17.00',
    shipping: '$13.00',
    status: 'cancelled',
    payment: 'COD',
    address: '555 Maple Drive, Miami, FL 33101',
    items: [
      { name: 'Mechanical Keyboard', qty: 1, price: '$169.00' },
    ]
  },
];

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

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            <Input placeholder="Search orders..." className="pl-10" />
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
            {orders.map((order) => (
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
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                      <DialogContent className="w-full h-full max-w-none max-h-none overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: { display: 'none' } }}>
                        <DialogHeader>
                          <DialogTitle className="text-3xl">
                            Order Details - {order.id}
                          </DialogTitle>

                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          {/* Order Status */}
                          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                              <p className="text-sm text-muted-foreground">Order Status</p>
                              <Badge variant={getStatusColor(order.status)} className="mt-1">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Payment Method</p>
                              <Badge variant="outline" className="mt-1">{order.payment}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Order Date</p>
                              <p className="font-medium mt-1">{order.date}</p>
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div>
                            <h3 className="font-semibold mb-3">Customer Information</h3>
                            <Card className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{order.customer}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{order.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{order.phone}</span>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="font-semibold mb-3">Shipping Address</h3>
                            <Card className="p-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <p className="text-sm">{order.address}</p>
                              </div>
                            </Card>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h3 className="font-semibold mb-3">Order Items</h3>
                            <Card>
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
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <Card className="p-4">
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
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              Update Status
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
                      <DialogContent className="w-full h-full max-w-none max-h-none overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: { display: 'none' } }}>
                        <DialogHeader>
                          <DialogTitle>Edit Order - {order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          {/* Edit Form */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                              <Input defaultValue={order.id} disabled />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <select className="w-full p-2 border rounded" defaultValue={order.status}>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Customer</label>
                              <Input defaultValue={order.customer} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Email</label>
                              <Input defaultValue={order.email} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Phone</label>
                              <Input defaultValue={order.phone} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Total</label>
                              <Input defaultValue={order.total} />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Address</label>
                            <textarea className="w-full p-2 border rounded" rows="3" defaultValue={order.address}></textarea>
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