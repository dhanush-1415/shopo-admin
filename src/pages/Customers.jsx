import { useState } from "react";
import { Search, Eye, Mail, Phone, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 890", orders: 12, totalSpent: "$1,234", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 891", orders: 8, totalSpent: "$856", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 892", orders: 5, totalSpent: "$432", status: "inactive" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "+1 234 567 893", orders: 15, totalSpent: "$2,100", status: "active" },
];

const orderHistory = [
  { id: "#ORD-001", date: "2024-01-15", amount: "$120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "$85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "$200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "$120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "$85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "$200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "$120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "$85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "$200", status: "processing" },
  { id: "#ORD-001", date: "2024-01-15", amount: "$120", status: "delivered" },
  { id: "#ORD-002", date: "2024-01-10", amount: "$85", status: "delivered" },
  { id: "#ORD-003", date: "2024-01-05", amount: "$200", status: "processing" },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer base</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="text-center">Contact</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-center">Total Spent</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="text-center font-medium">{customer.name}</TableCell>
                <TableCell className="text-center">
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
                <TableCell className="text-center">{customer.orders}</TableCell>
                <TableCell className="text-center font-medium">{customer.totalSpent}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                    {customer.status}
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
                            Customer Details
                          </DialogTitle>

                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Name</p>
                              <p className="text-lg font-semibold">{customer.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status</p>
                              <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                                {customer.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {customer.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Phone</p>
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {customer.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                              <p className="text-lg font-semibold">{customer.orders}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                              <p className="text-lg font-semibold text-primary">{customer.totalSpent}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Order History</h3>
                            <div className="max-h-80 overflow-y-auto border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {orderHistory.map((order, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{order.id}</TableCell>
                                      <TableCell>{order.date}</TableCell>
                                      <TableCell className="font-medium">{order.amount}</TableCell>
                                      <TableCell>
                                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                                          {order.status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
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
                          <DialogTitle>Edit Customer - {customer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 text-lg">
                          {/* Edit Form */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Name</label>
                              <Input defaultValue={customer.name} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <select className="w-full p-2 border rounded" defaultValue={customer.status}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Email</label>
                              <Input defaultValue={customer.email} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Phone</label>
                              <Input defaultValue={customer.phone} />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                              <Input defaultValue={customer.orders} type="number" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                              <Input defaultValue={customer.totalSpent} />
                            </div>
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
      </div>
    </div>
  );
}