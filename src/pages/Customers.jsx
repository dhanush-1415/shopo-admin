import { useState, useEffect } from "react";
import { Search, Eye, Mail, Phone, MapPin, User, Package, Hash, Award, Circle, FileText, MoreVertical, Loader2, RefreshCw } from "lucide-react";
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
import { toast } from 'sonner';
import { getAllCustomers, getCustomerById } from '@/api/services/customerService';
import { useAuthStore } from '@/store/authStore';

const getStatusVariant = (status) => {
  return status === "active" ? "default" : "secondary";
};

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function Customers() {
  const { getToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [pagination, setPagination] = useState(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await getAllCustomers(token);

      if (response.success) {
        setCustomers(response.data || []);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch customers');
        toast.error(response.error || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setError(error.message || 'An unexpected error occurred');
      toast.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = async (customerId) => {
    setIsLoadingCustomer(true);
    try {
      const token = getToken();
      const response = await getCustomerById(customerId, token);

      if (response.success) {
        setSelectedCustomer(response.data);
      } else {
        toast.error(response.error || 'Failed to fetch customer details');
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      toast.error('Failed to fetch customer details');
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  // Handle view customer
  const handleViewCustomer = (customerId) => {
    setSelectedCustomer(null);
    setIsViewDialogOpen(true);
    fetchCustomerDetails(customerId);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.includes(query)
    );
  });

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-auto"
              onClick={fetchCustomers}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-10 sm:h-auto">Export</Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading customers...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchCustomers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No customers found matching your search.' : 'No customers found.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left sm:text-center">Customer</TableHead>
                <TableHead className="text-left sm:text-center">Contact</TableHead>
                <TableHead className="text-left sm:text-center">Location</TableHead>
                <TableHead className="text-left sm:text-center">Joined</TableHead>
                <TableHead className="text-left sm:text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
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
                <TableCell className="text-left sm:text-center">
                  <div className="space-y-1">
                    {customer.city || customer.state || customer.country ? (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        {[customer.city, customer.state, customer.country].filter(Boolean).join(', ') || 'N/A'}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-left sm:text-center text-sm">
                  {formatDate(customer.createdAt)}
                </TableCell>
                <TableCell className="text-left sm:text-center">
                  <Badge variant={getStatusVariant(customer.status)} className="text-xs">
                    {getStatusLabel(customer.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1 sm:gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
        )}
      </Card>
      {pagination && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {customers.length} of {pagination.total} customers
          {pagination.totalPages > 1 && ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </div>
      )}

      {/* Customer View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
        setIsViewDialogOpen(open);
        if (!open) {
          setSelectedCustomer(null);
        }
      }}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 m-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details {selectedCustomer ? `- ${selectedCustomer.name}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto space-y-6">
            {isLoadingCustomer ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading customer details...</span>
              </div>
            ) : selectedCustomer ? (
              <>
                {/* Customer Header */}
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start md:gap-6 p-4 md:p-6">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                        <User className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl md:text-2xl font-bold">{selectedCustomer.name}</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Customer since {formatDate(selectedCustomer.createdAt)}
                      </p>
                      <Badge
                        variant={getStatusVariant(selectedCustomer.status)}
                        className="text-xs md:text-sm mt-2"
                      >
                        {getStatusLabel(selectedCustomer.status)}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 md:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Email</span>
                    </div>
                    <p className="text-sm md:text-base font-bold break-all">{selectedCustomer.email || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">contact</p>
                  </Card>

                  <Card className="p-4 md:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Phone</span>
                    </div>
                    <p className="text-sm md:text-base font-bold">{selectedCustomer.phone || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">mobile</p>
                  </Card>

                  <Card className="p-4 md:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Package className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Wishlist</span>
                    </div>
                    <p className="text-lg md:text-2xl font-bold">
                      {Array.isArray(selectedCustomer.wishList) ? selectedCustomer.wishList.length : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">items</p>
                  </Card>

                  <Card className="p-4 md:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Circle className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Status</span>
                    </div>
                    <Badge variant={getStatusVariant(selectedCustomer.status)} className="text-xs md:text-sm">
                      {getStatusLabel(selectedCustomer.status)}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">account</p>
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
                        <p className="font-medium text-sm md:text-base">{selectedCustomer.name || 'N/A'}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                        <Badge variant={getStatusVariant(selectedCustomer.status)} className="text-xs md:text-sm">
                          {getStatusLabel(selectedCustomer.status)}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground">Customer ID</p>
                        <p className="font-medium text-xs md:text-sm font-mono">{selectedCustomer.id || 'N/A'}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground">Joined</p>
                        <p className="font-medium text-sm md:text-base">{formatDate(selectedCustomer.createdAt)}</p>
                      </div>
                      {selectedCustomer.updatedAt && selectedCustomer.updatedAt !== selectedCustomer.createdAt && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-xs md:text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-medium text-sm md:text-base">{formatDate(selectedCustomer.updatedAt)}</p>
                          </div>
                        </>
                      )}
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Contact & Address
                    </h3>
                    <Card className="p-4 md:p-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-sm md:text-base break-all">{selectedCustomer.email || 'N/A'}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-sm md:text-base">{selectedCustomer.phone || 'N/A'}</p>
                      </div>
                      {(selectedCustomer.address || selectedCustomer.city || selectedCustomer.state || selectedCustomer.country || selectedCustomer.postalCode) && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-xs md:text-sm text-muted-foreground">Address</p>
                            <div className="font-medium text-sm md:text-base space-y-1">
                              {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                              <p>
                                {[
                                  selectedCustomer.city,
                                  selectedCustomer.state,
                                  selectedCustomer.postalCode
                                ].filter(Boolean).join(', ')}
                              </p>
                              {selectedCustomer.country && <p>{selectedCustomer.country}</p>}
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  </div>
                </div>

                {/* Remarks */}
                {selectedCustomer.remarks && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Remarks
                    </h3>
                    <Card className="p-4 md:p-6">
                      <p className="text-sm md:text-base">{selectedCustomer.remarks}</p>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Failed to load customer details.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}