import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash2, BadgeCheck, Shirt, Scissors, Palette, Droplets, Filter, ChevronDown, ChevronUp, X, Ruler, Upload, Download, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getAllColors, createColor } from '@/api/services/colorService';
import { getAllSizes, createSize, createSizeVariation } from '@/api/services/sizeService';
import { createSizeChart, getAllSizeCharts } from '@/api/services/sizeChartService';
import { getAllCategories } from '@/api/services/categoryService';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Variations() {
  const { getToken } = useAuthStore();
  // API colors state
  const [apiColors, setApiColors] = useState([]);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [colorError, setColorError] = useState(null);
  // State for colors table (uses API colors)
  const [availableColors, setAvailableColors] = useState([]);
  // States for topwear and bottomwear sizes from API
  const [apiSizes, setApiSizes] = useState([]);
  const [isLoadingSizes, setIsLoadingSizes] = useState(false);
  const [sizeError, setSizeError] = useState(null);
  const [topwearSizes, setTopwearSizes] = useState([]);
  const [bottomwearSizes, setBottomwearSizes] = useState([]);
  // States for size charts
  const [sizeCharts, setSizeCharts] = useState([]);
  const [isLoadingSizeCharts, setIsLoadingSizeCharts] = useState(false);
  const [sizeChartError, setSizeChartError] = useState(null);
  // States for categories (for size chart upload)
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  // Dialog states for adding colors/sizes/charts
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  const [isAddTopwearSizeOpen, setIsAddTopwearSizeOpen] = useState(false);
  const [isAddBottomwearSizeOpen, setIsAddBottomwearSizeOpen] = useState(false);
  const [isAddSizeChartOpen, setIsAddSizeChartOpen] = useState(false);
  const [newColorInput, setNewColorInput] = useState('');
  const [isCreatingColor, setIsCreatingColor] = useState(false);
  const [isCreatingTopwearSize, setIsCreatingTopwearSize] = useState(false);
  const [isCreatingBottomwearSize, setIsCreatingBottomwearSize] = useState(false);
  const [isCreatingSizeChart, setIsCreatingSizeChart] = useState(false);
  const [newTopwearSizeInput, setNewTopwearSizeInput] = useState('');
  const [newBottomwearSizeInput, setNewBottomwearSizeInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSizeChartFile, setSelectedSizeChartFile] = useState(null);
  const [editingColor, setEditingColor] = useState(null);
  const [editingTopwearSize, setEditingTopwearSize] = useState(null);
  const [editingBottomwearSize, setEditingBottomwearSize] = useState(null);
  // Drag state for size chart upload
  const [dragActive, setDragActive] = useState(false);
  // Search states
  const [colorSearch, setColorSearch] = useState('');
  const [topwearSearch, setTopwearSearch] = useState('');
  const [bottomwearSearch, setBottomwearSearch] = useState('');
  const [sizeChartSearch, setSizeChartSearch] = useState('');
  // Tab state
  const [activeTab, setActiveTab] = useState('colors');
  // File input ref for size chart
  const fileInputRef = useRef(null);

  // Fetch colors from API
  const fetchColors = async () => {
    setIsLoadingColors(true);
    setColorError(null);
    try {
      const token = getToken();
      const response = await getAllColors(token);

      if (response.success) {
        // Extract color names from API response
        const colorNames = response.data.map(color => 
          color.color || color.name || color
        );
        setApiColors(colorNames);
        setAvailableColors(colorNames);
      } else {
        setColorError(response.error || 'Failed to fetch colors');
        toast.error(response.error || 'Failed to fetch colors');
        setAvailableColors([]);
      }
    } catch (error) {
      console.error('Failed to fetch colors:', error);
      setColorError(error.message || 'An unexpected error occurred');
      toast.error('Failed to fetch colors');
      setAvailableColors([]);
    } finally {
      setIsLoadingColors(false);
    }
  };

  // Fetch sizes from API
  const fetchSizes = async () => {
    setIsLoadingSizes(true);
    setSizeError(null);
    try {
      const token = getToken();
      const response = await getAllSizes(token);

      if (response.success) {
        setApiSizes(response.data || []);
        
        // Extract topwear and bottomwear sizes
        const topwearData = response.data.find(item => 
          item.type?.toLowerCase() === 'topwear'
        );
        const bottomwearData = response.data.find(item => 
          item.type?.toLowerCase() === 'bottomwear'
        );
        
        setTopwearSizes(topwearData?.size || []);
        setBottomwearSizes(bottomwearData?.size || []);
      } else {
        setSizeError(response.error || 'Failed to fetch sizes');
        toast.error(response.error || 'Failed to fetch sizes');
        setTopwearSizes([]);
        setBottomwearSizes([]);
      }
    } catch (error) {
      console.error('Failed to fetch sizes:', error);
      setSizeError(error.message || 'An unexpected error occurred');
      toast.error('Failed to fetch sizes');
      setTopwearSizes([]);
      setBottomwearSizes([]);
    } finally {
      setIsLoadingSizes(false);
    }
  };

  // Filter functions
  const filteredColors = availableColors.filter(color => 
    color.toLowerCase().includes(colorSearch.toLowerCase())
  );
  const filteredTopwearSizes = topwearSizes.filter(size => 
    size.toLowerCase().includes(topwearSearch.toLowerCase())
  );
  const filteredBottomwearSizes = bottomwearSizes.filter(size => 
    size.toLowerCase().includes(bottomwearSearch.toLowerCase())
  );
  const filteredSizeCharts = sizeCharts.filter(chart => 
    chart.name.toLowerCase().includes(sizeChartSearch.toLowerCase())
  );

  // Fetch categories for size chart upload
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const token = getToken();
      const response = await getAllCategories(token);
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        toast.error(response.error || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch size charts from API
  const fetchSizeCharts = async () => {
    setIsLoadingSizeCharts(true);
    setSizeChartError(null);
    try {
      const token = getToken();
      const response = await getAllSizeCharts(token);

      if (response.success) {
        // Transform API response to UI format
        const transformedCharts = (response.data || []).map((chart) => {
          // Format date from ISO string to readable format
          const formatDate = (dateString) => {
            if (!dateString) return new Date().toLocaleDateString();
            try {
              return new Date(dateString).toLocaleDateString();
            } catch {
              return dateString;
            }
          };

          return {
            id: chart.id || String(Date.now()),
            name: chart.name || chart.image || 'Size Chart',
            type: chart.type || (chart.image?.includes('.pdf') ? 'application/pdf' : 'image'),
            date: formatDate(chart.createdAt || chart.updatedAt),
            file: chart.image || chart.file,
            imageUrl: chart.image, // Store image URL from API
            categoryId: chart.categoryId,
            categoryName: chart.category?.name || 'Unknown Category',
          };
        });
        setSizeCharts(transformedCharts);
      } else {
        setSizeChartError(response.error || 'Failed to fetch size charts');
        toast.error(response.error || 'Failed to fetch size charts');
        setSizeCharts([]);
      }
    } catch (error) {
      console.error('Failed to fetch size charts:', error);
      setSizeChartError(error.message || 'An unexpected error occurred');
      toast.error('Failed to fetch size charts');
      setSizeCharts([]);
    } finally {
      setIsLoadingSizeCharts(false);
    }
  };

  // Fetch colors and sizes on component mount
  useEffect(() => {
    fetchColors();
    fetchSizes();
    fetchCategories();
    fetchSizeCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag handlers for size chart upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection for size charts
  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedSizeChartFile(file);
    } else {
      toast.error('Please select a valid image or PDF file');
    }
  };

  // Handle file select click
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Handle size chart upload via API
  const handleSizeChartUpload = async () => {
    if (!selectedSizeChartFile) {
      toast.error('Please select a file');
      return;
    }
    if (!selectedCategoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsCreatingSizeChart(true);
    try {
      const token = getToken();
      const response = await createSizeChart({
        categoryId: selectedCategoryId,
        image: selectedSizeChartFile,
      }, token);

      if (response.success) {
        toast.success('Size chart uploaded successfully');
        setIsAddSizeChartOpen(false);
        setSelectedSizeChartFile(null);
        setSelectedCategoryId('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh size charts list
        fetchSizeCharts();
      } else {
        toast.error(response.error || 'Failed to upload size chart');
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsCreatingSizeChart(false);
    }
  };

  // Download/View size chart
  const handleDownload = (fileOrUrl, fileName) => {
    if (fileOrUrl) {
      // If it's a URL string, open in new tab
      if (typeof fileOrUrl === 'string') {
        window.open(fileOrUrl, '_blank');
      } else if (fileOrUrl instanceof File) {
        // If it's a File object, create download link
        const url = URL.createObjectURL(fileOrUrl);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || fileOrUrl.name || 'size-chart';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  // Delete size chart
  const handleDeleteSizeChart = (id) => {
    setSizeCharts(prev => prev.filter(c => c.id !== id));
    // TODO: Call delete API endpoint if available
    // For now, just remove from local state
    // After API integration, refresh the list: fetchSizeCharts();
  };

  // Add custom color via API
  const handleAddCustomColor = async () => {
    if (!newColorInput.trim()) {
      toast.error('Please enter a color name');
      return;
    }

    const trimmedColor = newColorInput.trim();
    if (availableColors.some(c => c.toLowerCase() === trimmedColor.toLowerCase())) {
      toast.error('This color already exists');
      return;
    }

    setIsCreatingColor(true);
    try {
      const token = getToken();
      const response = await createColor({ color: trimmedColor }, token);

      if (response.success) {
        // Extract color name from API response
        // API might return: { success: true, data: { color: "Red" } } or { success: true, data: { id: 1, color: "Red" } }
        let newColor = trimmedColor; // fallback to input
        if (response.data) {
          if (typeof response.data === 'string') {
            newColor = response.data;
          } else if (response.data.color) {
            newColor = response.data.color;
          } else if (response.data.data && response.data.data.color) {
            newColor = response.data.data.color;
          }
        }

        // Add new color to the list
        setApiColors(prev => [...prev, newColor]);
        setAvailableColors(prev => [...prev, newColor]);
        setNewColorInput('');
        setIsAddColorOpen(false);
        toast.success('Color created successfully!');
      } else {
        toast.error(response.error || 'Failed to create color');
      }
    } catch (error) {
      console.error('Failed to create color:', error);
      toast.error(error.message || 'Failed to create color');
    } finally {
      setIsCreatingColor(false);
    }
  };

  // Edit custom color (Note: API doesn't support edit, so this is local only)
  const handleEditColor = (oldColor, newColor) => {
    if (newColor.trim() && newColor.trim() !== oldColor) {
      const tempAvailable = [...availableColors];
      const index = tempAvailable.indexOf(oldColor);
      if (index > -1) {
        tempAvailable[index] = newColor.trim();
        setAvailableColors(tempAvailable);
        // Update API colors state as well
        const apiIndex = apiColors.indexOf(oldColor);
        if (apiIndex > -1) {
          setApiColors(prev => {
            const updated = [...prev];
            updated[apiIndex] = newColor.trim();
            return updated;
          });
        }
      }
      setEditingColor(null);
      toast.info('Color updated locally. Note: API doesn\'t support color editing.');
    }
  };

  // Delete custom color (Note: API doesn't support delete, so this is local only)
  const handleDeleteColor = (colorToDelete) => {
    setApiColors(prev => prev.filter(c => c !== colorToDelete));
    setAvailableColors(prev => prev.filter(c => c !== colorToDelete));
    toast.info('Color removed locally. Note: API doesn\'t support color deletion.');
  };

  // Add custom size to topwear via API
  const handleAddCustomTopwearSize = async () => {
    if (!newTopwearSizeInput.trim()) {
      toast.error('Please enter a size');
      return;
    }

    const trimmed = newTopwearSizeInput.trim();
    if (topwearSizes.includes(trimmed)) {
      toast.error('This size already exists');
      return;
    }

    setIsCreatingTopwearSize(true);
    try {
      const token = getToken();
      const response = await createSize(
        {
          type: 'Topwear',
          size: [trimmed],
        },
        token
      );

      if (response.success) {
        // Refresh sizes from API
        await fetchSizes();
        setNewTopwearSizeInput('');
        setIsAddTopwearSizeOpen(false);
        toast.success('Topwear size created successfully!');
      } else {
        toast.error(response.error || 'Failed to create size');
      }
    } catch (error) {
      console.error('Failed to create topwear size:', error);
      toast.error(error.message || 'Failed to create size');
    } finally {
      setIsCreatingTopwearSize(false);
    }
  };

  // Edit topwear size (local only, not persisted to API)
  const handleEditTopwearSize = (oldSize, newSize) => {
    if (newSize.trim() && newSize.trim() !== oldSize) {
      setTopwearSizes(prev => prev.map(s => s === oldSize ? newSize.trim() : s));
      setEditingTopwearSize(null);
      toast.info('Size updated locally. Note: Changes are not persisted to API.');
    }
  };

  // Delete topwear size (local only, not persisted to API)
  const handleDeleteTopwearSize = (sizeToDelete) => {
    setTopwearSizes(prev => prev.filter(s => s !== sizeToDelete));
    toast.info('Size removed locally. Note: Changes are not persisted to API.');
  };

  // Add custom size to bottomwear via API
  const handleAddCustomBottomwearSize = async () => {
    if (!newBottomwearSizeInput.trim()) {
      toast.error('Please enter a size');
      return;
    }

    const trimmed = newBottomwearSizeInput.trim();
    if (bottomwearSizes.includes(trimmed)) {
      toast.error('This size already exists');
      return;
    }

    setIsCreatingBottomwearSize(true);
    try {
      const token = getToken();
      const response = await createSizeVariation(
        {
          type: 'Bottomwear',
          size: [trimmed],
        },
        token
      );

      if (response.success) {
        // Refresh sizes from API
        await fetchSizes();
        setNewBottomwearSizeInput('');
        setIsAddBottomwearSizeOpen(false);
        toast.success('Bottomwear size created successfully!');
      } else {
        toast.error(response.error || 'Failed to create size');
      }
    } catch (error) {
      console.error('Failed to create bottomwear size:', error);
      toast.error(error.message || 'Failed to create size');
    } finally {
      setIsCreatingBottomwearSize(false);
    }
  };

  // Edit bottomwear size (local only, not persisted to API)
  const handleEditBottomwearSize = (oldSize, newSize) => {
    if (newSize.trim() && newSize.trim() !== oldSize) {
      setBottomwearSizes(prev => prev.map(s => s === oldSize ? newSize.trim() : s));
      setEditingBottomwearSize(null);
      toast.info('Size updated locally. Note: Changes are not persisted to API.');
    }
  };

  // Delete bottomwear size (local only, not persisted to API)
  const handleDeleteBottomwearSize = (sizeToDelete) => {
    setBottomwearSizes(prev => prev.filter(s => s !== sizeToDelete));
    toast.info('Size removed locally. Note: Changes are not persisted to API.');
  };

  // Render a generic row for colors/sizes
  const renderRow = (items, searchTerm, editingIndex, setEditingIndex, handleEdit, handleDelete, isDefaultList, defaultItems, type) => {
    const filteredItems = items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <TableBody>
        {filteredItems.map((item, index) => {
          const globalIndex = items.indexOf(item); // Map to original array index for editing
          return (
            <TableRow key={item} className="hover:bg-muted/50 border-b">
              <TableCell className="font-medium flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {type === 'color' && <Droplets className="h-4 w-4 text-muted-foreground" />}
                  {type === 'topwear' && <Shirt className="h-4 w-4 text-muted-foreground" />}
                  {type === 'bottomwear' && <Scissors className="h-4 w-4 text-muted-foreground" />}
                  {editingIndex === globalIndex ? (
                    <Input
                      value={item}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[globalIndex] = e.target.value;
                        if (type === 'color') setAvailableColors(updated);
                        else if (type === 'topwear') setTopwearSizes(updated);
                        else setBottomwearSizes(updated);
                      }}
                      onBlur={() => handleEdit(item, item.trim())}
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit(item, item.trim())}
                      autoFocus
                      className="max-w-xs"
                    />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={isDefaultList.includes(item) ? "default" : "secondary"}>
                  {isDefaultList.includes(item) ? "Default" : "Custom"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setEditingIndex(globalIndex)} 
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!isDefaultList.includes(item) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {type}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the {item} option for {type}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {filteredItems.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
              No {type} found matching "{searchTerm}". Try adjusting your search.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  const ColorsSection = () => (
    <CardContent className="p-0 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6 px-4">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter colors..." 
            value={colorSearch}
            onChange={(e) => setColorSearch(e.target.value)}
            className="max-w-sm bg-transparent border-none focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchColors}
            disabled={isLoadingColors}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingColors ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 px-4 py-2">
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
      {isLoadingColors ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading colors...</span>
        </div>
      ) : colorError ? (
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">{colorError}</p>
          <Button onClick={fetchColors} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderRow(availableColors, colorSearch, editingColor, setEditingColor, handleEditColor, handleDeleteColor, [], [], 'color')}
          </Table>
        </ScrollArea>
      )}
    </CardContent>
  );

  const TopwearSection = () => (
    <CardContent className="p-0 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6 px-4">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter topwear sizes..." 
            value={topwearSearch}
            onChange={(e) => setTopwearSearch(e.target.value)}
            className="max-w-sm bg-transparent border-none focus-visible:ring-0"
          />
        </div>
        <Dialog open={isAddTopwearSizeOpen} onOpenChange={setIsAddTopwearSizeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 px-4 py-2">
              <Plus className="h-4 w-4" />
              Add Size
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      {isLoadingSizes ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderRow(topwearSizes, topwearSearch, editingTopwearSize, setEditingTopwearSize, handleEditTopwearSize, handleDeleteTopwearSize, [], [], 'topwear')}
          </Table>
        </ScrollArea>
      )}
    </CardContent>
  );

  const BottomwearSection = () => (
    <CardContent className="p-0 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6 px-4">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter bottomwear sizes..." 
            value={bottomwearSearch}
            onChange={(e) => setBottomwearSearch(e.target.value)}
            className="max-w-sm bg-transparent border-none focus-visible:ring-0"
          />
        </div>
        <Dialog open={isAddBottomwearSizeOpen} onOpenChange={setIsAddBottomwearSizeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 px-4 py-2">
              <Plus className="h-4 w-4" />
              Add Size
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      {isLoadingSizes ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {renderRow(bottomwearSizes, bottomwearSearch, editingBottomwearSize, setEditingBottomwearSize, handleEditBottomwearSize, handleDeleteBottomwearSize, [], [], 'bottomwear')}
          </Table>
        </ScrollArea>
      )}
    </CardContent>
  );

  const SizeChartSection = () => (
    <CardContent className="p-0 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6 px-4">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter size charts..." 
            value={sizeChartSearch}
            onChange={(e) => setSizeChartSearch(e.target.value)}
            className="max-w-sm bg-transparent border-none focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={fetchSizeCharts}
            disabled={isLoadingSizeCharts}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingSizeCharts ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddSizeChartOpen} onOpenChange={setIsAddSizeChartOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 px-4 py-2">
                <Plus className="h-4 w-4" />
                Upload Size Chart
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
      {isLoadingSizeCharts ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sizeChartError ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-sm text-destructive">{sizeChartError}</p>
          <Button variant="outline" onClick={fetchSizeCharts} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : (
        <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSizeCharts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {sizeChartSearch ? `No size charts found matching "${sizeChartSearch}"` : 'No size charts found. Upload a new one to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSizeCharts.map((chart) => (
                  <TableRow key={chart.id} className="hover:bg-muted/50 border-b">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span>{chart.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {chart.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {chart.type?.includes('pdf') ? 'PDF' : 'Image'}
                      </Badge>
                    </TableCell>
                    <TableCell>{chart.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {chart.imageUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleDownload(chart.imageUrl, chart.name)}
                            aria-label="View"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete size chart?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the {chart.name} file.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSizeChart(chart.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </CardContent>
  );

  const StatCard = ({ icon: Icon, count, label }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <Icon className="h-5 w-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold text-primary">{count}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'sizecharts':
        return 'Size Charts';
      case 'colors':
        return 'Colors';
      default:
        return `${tab} Sizes`;
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'colors':
        return availableColors.length;
      case 'topwear':
        return topwearSizes.length;
      case 'bottomwear':
        return bottomwearSizes.length;
      case 'sizecharts':
        return sizeCharts.length;
      default:
        return 0;
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'colors':
        return <Droplets className="h-4 w-4" />;
      case 'topwear':
        return <Shirt className="h-4 w-4" />;
      case 'bottomwear':
        return <Scissors className="h-4 w-4" />;
      case 'sizecharts':
        return <Ruler className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Title Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Variations Management</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Customize colors (global), sizes for topwear & bottomwear, and upload size charts to streamline product creation.</p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Droplets} count={availableColors.length} label="Total Colors" />
        <StatCard icon={Shirt} count={topwearSizes.length} label="Total Topwear Sizes" />
        <StatCard icon={Scissors} count={bottomwearSizes.length} label="Total Bottomwear Sizes" />
        <StatCard icon={Ruler} count={sizeCharts.length} label="Total Size Charts" />
      </div>

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={activeTab === 'colors' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('colors')}
          className="flex-1 min-w-[120px]"
        >
          Colors ({availableColors.length})
        </Button>
        <Button 
          variant={activeTab === 'topwear' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('topwear')}
          className="flex-1 min-w-[120px]"
        >
          Topwear Sizes ({topwearSizes.length})
        </Button>
        <Button 
          variant={activeTab === 'bottomwear' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('bottomwear')}
          className="flex-1 min-w-[120px]"
        >
          Bottomwear Sizes ({bottomwearSizes.length})
        </Button>
        <Button 
          variant={activeTab === 'sizecharts' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('sizecharts')}
          className="flex-1 min-w-[120px]"
        >
          Size Charts ({sizeCharts.length})
        </Button>
      </div>

      {/* Tab Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2">
            {getTabIcon(activeTab)}
            <h3 className="font-semibold">
              {getTabTitle(activeTab)} ({getTabCount(activeTab)})
            </h3>
          </div>
        </CardHeader>
      {activeTab === 'colors' && <ColorsSection />}
      {activeTab === 'topwear' && <TopwearSection />}
      {activeTab === 'bottomwear' && <BottomwearSection />}
      {activeTab === 'sizecharts' && <SizeChartSection />}
    </Card>

    {/* Add Color Dialog - Outside ColorsSection to prevent re-renders */}
    <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Color</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCustomColor();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Enter new color (e.g., Teal)"
            value={newColorInput}
            onChange={(e) => {
              e.stopPropagation();
              setNewColorInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isCreatingColor) {
                e.preventDefault();
                handleAddCustomColor();
              }
            }}
            autoFocus
            disabled={isCreatingColor}
          />
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsAddColorOpen(false);
                setNewColorInput('');
              }}
              disabled={isCreatingColor}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!newColorInput.trim() || isCreatingColor}
            >
              {isCreatingColor ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Add Topwear Size Dialog - Outside TopwearSection to prevent re-renders */}
    <Dialog open={isAddTopwearSizeOpen} onOpenChange={setIsAddTopwearSizeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Topwear Size</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newTopwearSizeInput.trim() && !isCreatingTopwearSize) {
              handleAddCustomTopwearSize();
            }
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Enter new size (e.g., 5XL)"
            value={newTopwearSizeInput}
            onChange={(e) => {
              e.stopPropagation();
              setNewTopwearSizeInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newTopwearSizeInput.trim() && !isCreatingTopwearSize) {
                  handleAddCustomTopwearSize();
                }
              }
            }}
            autoFocus
            disabled={isCreatingTopwearSize}
          />
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsAddTopwearSizeOpen(false);
                setNewTopwearSizeInput('');
              }}
              disabled={isCreatingTopwearSize}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!newTopwearSizeInput.trim() || isCreatingTopwearSize}
            >
              {isCreatingTopwearSize ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Add Bottomwear Size Dialog - Outside BottomwearSection to prevent re-renders */}
    <Dialog open={isAddBottomwearSizeOpen} onOpenChange={setIsAddBottomwearSizeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bottomwear Size</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newBottomwearSizeInput.trim() && !isCreatingBottomwearSize) {
              handleAddCustomBottomwearSize();
            }
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Enter new size (e.g., 42)"
            value={newBottomwearSizeInput}
            onChange={(e) => {
              e.stopPropagation();
              setNewBottomwearSizeInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newBottomwearSizeInput.trim() && !isCreatingBottomwearSize) {
                  handleAddCustomBottomwearSize();
                }
              }
            }}
            autoFocus
            disabled={isCreatingBottomwearSize}
          />
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsAddBottomwearSizeOpen(false);
                setNewBottomwearSizeInput('');
              }}
              disabled={isCreatingBottomwearSize}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!newBottomwearSizeInput.trim() || isCreatingBottomwearSize}
            >
              {isCreatingBottomwearSize ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Add Size Chart Dialog - Outside SizeChartSection to prevent re-renders */}
    <Dialog open={isAddSizeChartOpen} onOpenChange={setIsAddSizeChartOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Size Chart</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedSizeChartFile && selectedCategoryId && !isCreatingSizeChart) {
              handleSizeChartUpload();
            }
          }}
          className="space-y-4"
        >
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(value) => {
                setSelectedCategoryId(value);
              }}
              disabled={isLoadingCategories || isCreatingSizeChart}
            >
              <SelectTrigger 
                id="category" 
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Size Chart File *</Label>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                e.stopPropagation();
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
              ref={fileInputRef}
              disabled={isCreatingSizeChart}
            />
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted'
              } ${isCreatingSizeChart ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrag(e);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrag(e);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrag(e);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isCreatingSizeChart) {
                  handleFileSelectClick();
                }
              }}
            >
              <div className="flex flex-col items-center justify-center py-8">
                {selectedSizeChartFile ? (
                  <div className="space-y-2">
                    <BadgeCheck className="h-8 w-8 mb-2 text-primary" />
                    <p className="text-sm font-medium mb-1">{selectedSizeChartFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Click to select a different file
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className={`h-8 w-8 mb-2 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-sm font-medium mb-1">Drag & drop your file here, or click to select from your computer</p>
                    <p className={`text-xs mb-4 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      Supports PDF and images (JPG, PNG, etc.)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddSizeChartOpen(false);
                setSelectedSizeChartFile(null);
                setSelectedCategoryId('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isCreatingSizeChart}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!selectedSizeChartFile || !selectedCategoryId || isCreatingSizeChart}
            >
              {isCreatingSizeChart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}