import { useState } from "react";
import { Plus, Percent, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const coupons = [
  { id: 1, code: "SAVE20", discount: "20%", type: "percentage", validUntil: "2024-12-31", used: 45, limit: 100, status: "active" },
  { id: 2, code: "FLAT100", discount: "$100", type: "fixed", validUntil: "2024-11-30", used: 23, limit: 50, status: "active" },
  { id: 3, code: "SUMMER25", discount: "25%", type: "percentage", validUntil: "2024-08-31", used: 150, limit: 150, status: "expired" },
  { id: 4, code: "WELCOME10", discount: "10%", type: "percentage", validUntil: "2024-12-31", used: 89, limit: 200, status: "active" },
];

export default function Discounts() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discounts & Coupons</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional offers</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input id="code" placeholder="e.g., SAVE20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Discount Value</Label>
                <Input id="value" placeholder="e.g., 20 or 100" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Usage Limit</Label>
                <Input id="limit" placeholder="e.g., 100" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Valid Until</Label>
                <Input id="expiry" type="date" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Create Coupon</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Active Coupons</span>
          </div>
          <p className="text-3xl font-bold">{coupons.filter(c => c.status === "active").length}</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Percent className="h-4 w-4" />
            <span className="text-sm font-medium">Total Redemptions</span>
          </div>
          <p className="text-3xl font-bold">{coupons.reduce((sum, c) => sum + c.used, 0)}</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Expiring Soon</span>
          </div>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Avg. Discount</span>
          </div>
          <p className="text-3xl font-bold">18%</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                <TableCell className="font-medium text-primary">{coupon.discount}</TableCell>
                <TableCell className="capitalize">{coupon.type}</TableCell>
                <TableCell>{coupon.validUntil}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {coupon.used} / {coupon.limit}
                  </span>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${(coupon.used / coupon.limit) * 100}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.status === "active" ? "default" : "secondary"}>
                    {coupon.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}