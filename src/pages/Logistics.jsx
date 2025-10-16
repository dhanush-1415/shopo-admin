import { useState } from "react";
import { Plus, Truck, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pincodes = [
  { id: 1, pincode: "110001", city: "Delhi", state: "Delhi", serviceable: true, cod: true, estimatedDays: "2-3" },
  { id: 2, pincode: "400001", city: "Mumbai", state: "Maharashtra", serviceable: true, cod: true, estimatedDays: "3-4" },
  { id: 3, pincode: "560001", city: "Bangalore", state: "Karnataka", serviceable: true, cod: false, estimatedDays: "2-3" },
  { id: 4, pincode: "600001", city: "Chennai", state: "Tamil Nadu", serviceable: true, cod: true, estimatedDays: "3-4" },
  { id: 5, pincode: "700001", city: "Kolkata", state: "West Bengal", serviceable: false, cod: false, estimatedDays: "N/A" },
];

export default function Logistics() {
  const [newPincode, setNewPincode] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logistics</h1>
          <p className="text-muted-foreground mt-1">Manage shipping and delivery settings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviceable Pincodes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pincodes.filter(p => p.serviceable).length}</div>
            <p className="text-xs text-muted-foreground">Out of {pincodes.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COD Available</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pincodes.filter(p => p.cod).length}</div>
            <p className="text-xs text-muted-foreground">Cash on Delivery enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2-4 days</div>
            <p className="text-xs text-muted-foreground">For serviceable areas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Pincode</CardTitle>
          <CardDescription>Configure serviceability for a new area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter pincode"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              className="max-w-xs"
            />
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Pincode
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Pincode Serviceability</h3>
          <p className="text-sm text-muted-foreground">Manage delivery areas and COD availability</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pincode</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Serviceable</TableHead>
              <TableHead>COD Available</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pincodes.map((pincode) => (
              <TableRow key={pincode.id}>
                <TableCell className="font-mono font-semibold">{pincode.pincode}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{pincode.city}</p>
                    <p className="text-sm text-muted-foreground">{pincode.state}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={pincode.serviceable} />
                    <Badge variant={pincode.serviceable ? "default" : "secondary"}>
                      {pincode.serviceable ? "Yes" : "No"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={pincode.cod} />
                    <Badge variant={pincode.cod ? "default" : "secondary"}>
                      {pincode.cod ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{pincode.estimatedDays} days</TableCell>
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