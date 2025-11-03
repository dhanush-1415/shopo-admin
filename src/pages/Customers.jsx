import { useState } from "react";
import { Search, Eye, Mail, Phone, MapPin, Edit, User, DollarSign, Package, Hash, Award, Circle, ListOrdered, Save, X, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 890", orders: 12, totalSpent: "₹1,234", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 891", orders: 8, totalSpent: "₹856", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 892", orders: 5, totalSpent: "₹432", status: "inactive" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "+1 234 567 893", orders: 15, totalSpent: "₹2,100", status: "active" },
];

const orderHistory = [
  { id: "#ORD-001", date: "2024-01-15", amount: "₹120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "₹85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "₹200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "₹120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "₹85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "₹200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "₹120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "₹85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "₹200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "₹120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "₹85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "₹200", status: "processing" },
];

const getStatusVariant = (status) => {
  return status === "active" ? "default" : "secondary";
};

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your customer base</p>
        </div>
        <Button className="gap-2 px-4 sm:px-6 h-10 sm:h-auto">
          Add Customer
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-auto"
            />
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
              <TableHead className="text-left sm:text-center">Customer</TableHead>
              <TableHead className="text-left sm:text-center">Contact</TableHead>
              <TableHead className="text-left sm:text-center">Orders</TableHead>
              <TableHead className="text-left sm:text-center">Total Spent</TableHead>
              <TableHead className="text-left sm:text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-left sm:text-center">{customer.name}</TableCell>
                <TableCell className="text-left sm:text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left sm:text-center">{customer.orders}</TableCell>
                <TableCell className="font-semibold text-left sm:text-center">{customer.totalSpent}</TableCell>
                <TableCell className="text-left sm:text-center">
                  <Badge variant={getStatusVariant(customer.status)} className="text-xs">
                    {getStatusLabel(customer.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1 sm:gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
                        <DialogHeader className="p-6 border-b">
                          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Customer Details - {customer.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto space-y-6">
                          {/* Customer Header */}
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                              <div className="flex-shrink-0 mb-4 md:mb-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                                  <User className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                <h2 className="text-xl md:text-2xl font-bold">{customer.name}</h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Loyal customer with multiple purchases.</p>
                                <Badge
                                  variant={getStatusVariant(customer.status)}
                                  className="text-xs md:text-sm mt-2"
                                >
                                  {getStatusLabel(customer.status)}
                                </Badge>
                              </div>
                            </div>
                          </Card>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Package className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Orders</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{customer.orders}</p>
                              <p className="text-xs text-muted-foreground">total orders</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Spent</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold text-primary">{customer.totalSpent}</p>
                              <p className="text-xs text-muted-foreground">lifetime value</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Email</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{customer.email}</p>
                              <p className="text-xs text-muted-foreground">contact</p>
                            </Card>

                            <Card className="p-4 md:p-6 text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                                <Phone className="h-4 w-4" />
                                <span className="text-xs md:text-sm">Phone</span>
                              </div>
                              <p className="text-lg md:text-2xl font-bold">{customer.phone}</p>
                              <p className="text-xs text-muted-foreground">mobile</p>
                            </Card>
                          </div>

                          {/* Customer Information */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Basic Information
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Name</p>
                                  <p className="font-medium text-sm md:text-base">{customer.name}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                                  <Badge variant={getStatusVariant(customer.status)} className="text-xs md:text-sm">
                                    {getStatusLabel(customer.status)}
                                  </Badge>
                                </div>
                              </Card>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Contact Details
                              </h3>
                              <Card className="p-4 md:p-6 space-y-4">
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium text-sm md:text-base">{customer.email}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                                  <p className="font-medium text-sm md:text-base">{customer.phone}</p>
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Order History */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <ListOrdered className="h-4 w-4" />
                              Order History
                            </h3>
                            <Card className="p-4 md:p-6">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead className="text-center">Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {orderHistory.map((order, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{order.id}</TableCell>
                                      <TableCell className="text-center">{order.date}</TableCell>
                                      <TableCell className="text-right font-medium">{order.amount}</TableCell>
                                      <TableCell className="text-center">
                                        <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-xs">
                                          {getStatusLabel(order.status)}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Card>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button variant="outline" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
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
                            Edit Customer - {customer.name}
                          </DialogTitle>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">Update customer details to keep your records accurate.</p>
                        </DialogHeader>
                        <div className="p-6 space-y-6 overflow-y-auto">
                          {/* Basic Info Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Name
                                </Label>
                                <Input id="name" defaultValue={customer.name} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Circle className="h-4 w-4" />
                                  Status
                                </Label>
                                <Select defaultValue={customer.status}>
                                  <SelectTrigger className="h-10 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Contact Details Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email
                                </Label>
                                <Input id="email" defaultValue={customer.email} className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone
                                </Label>
                                <Input id="phone" defaultValue={customer.phone} className="h-10 text-sm" />
                              </div>
                            </div>
                          </div>

                          {/* Summary Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Summary
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="orders" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  Total Orders
                                </Label>
                                <Input id="orders" defaultValue={customer.orders} type="number" className="h-10 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="totalSpent" className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  Total Spent (₹)
                                </Label>
                                <Input id="totalSpent" defaultValue={customer.totalSpent.replace('₹', '')} type="number" step="0.01" className="h-10 text-sm" />
                              </div>
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
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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