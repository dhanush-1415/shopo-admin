import { useState } from "react";
import { Plus, Gift, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const giftCards = [
  { id: 1, code: "GIFT-2024-001", amount: "$100", issued: "2024-01-15", status: "active", balance: "$100", issuedTo: "john@example.com" },
  { id: 2, code: "GIFT-2024-002", amount: "$50", issued: "2024-01-18", status: "active", balance: "$25", issuedTo: "jane@example.com" },
  { id: 3, code: "GIFT-2024-003", amount: "$200", issued: "2024-01-20", status: "redeemed", balance: "$0", issuedTo: "mike@example.com" },
  { id: 4, code: "GIFT-2024-004", amount: "$75", issued: "2024-01-22", status: "active", balance: "$75", issuedTo: "sarah@example.com" },
  { id: 5, code: "GIFT-2024-005", amount: "$150", issued: "2024-01-25", status: "expired", balance: "$50", issuedTo: "alex@example.com" },
];

export default function GiftCards() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gift Cards</h1>
          <p className="text-muted-foreground mt-1">Manage gift cards and vouchers</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gift Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email</Label>
                <Input id="recipient" type="email" placeholder="customer@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Gift Card Amount</Label>
                <Input id="amount" type="number" placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Input id="message" placeholder="Happy Birthday!" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Create Gift Card</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{giftCards.length}</div>
            <p className="text-xs text-muted-foreground">
              {giftCards.filter(g => g.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$575</div>
            <p className="text-xs text-muted-foreground">Across all cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$325</div>
            <p className="text-xs text-muted-foreground">56.5% redemption rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250</div>
            <p className="text-xs text-muted-foreground">Available to use</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gift Card Code</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Issued To</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-mono font-semibold">{card.code}</TableCell>
                <TableCell className="font-medium text-primary">{card.amount}</TableCell>
                <TableCell>{card.issuedTo}</TableCell>
                <TableCell>{card.issued}</TableCell>
                <TableCell className="font-medium">{card.balance}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      card.status === "active"
                        ? "default"
                        : card.status === "redeemed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {card.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}