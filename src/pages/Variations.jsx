import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash2, BadgeCheck, Shirt, Scissors, Palette, Droplets, Filter, ChevronDown, ChevronUp, X, Ruler, Upload, Download } from 'lucide-react';
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

const defaultTopwearSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
const defaultBottomwearSizes = ['28', '30', '32', '34', '36', '38', '40'];

const defaultColors = [
  'White',
  'Black',
  'Grey',
  'Graphite Grey',
  'Navy',
  'Blue',
  'Indigo Blue',
  'Sand Beige',
  'Brown',
  'Tan',
  'Red',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
  'Multi-color'
];

export default function Variations() {
  // Global state for available colors (persistent across sessions)
  const [customColors, setCustomColors] = useState(['Teal', 'Maroon']); // Sample custom data
  // State for colors table (combines default + custom)
  const [availableColors, setAvailableColors] = useState([...defaultColors]);
  // States for topwear and bottomwear sizes
  const [customTopwearSizes, setCustomTopwearSizes] = useState(['5XL']); // Sample custom data
  const [customBottomwearSizes, setCustomBottomwearSizes] = useState(['42', '44']); // Sample custom data
  const [topwearSizes, setTopwearSizes] = useState([...defaultTopwearSizes, ...customTopwearSizes]);
  const [bottomwearSizes, setBottomwearSizes] = useState([...defaultBottomwearSizes, ...customBottomwearSizes]);
  // States for size charts
  const [sizeCharts, setSizeCharts] = useState([]);
  // Dialog states for adding colors/sizes/charts
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  const [isAddTopwearSizeOpen, setIsAddTopwearSizeOpen] = useState(false);
  const [isAddBottomwearSizeOpen, setIsAddBottomwearSizeOpen] = useState(false);
  const [isAddSizeChartOpen, setIsAddSizeChartOpen] = useState(false);
  const [newColorInput, setNewColorInput] = useState('');
  const [newTopwearSizeInput, setNewTopwearSizeInput] = useState('');
  const [newBottomwearSizeInput, setNewBottomwearSizeInput] = useState('');
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

  // Update available colors from global custom (real-time persistent)
  useEffect(() => {
    setAvailableColors([...defaultColors, ...customColors]);
  }, [customColors]);

  // Update available sizes for topwear and bottomwear
  useEffect(() => {
    setTopwearSizes([...defaultTopwearSizes, ...customTopwearSizes]);
  }, [customTopwearSizes]);

  useEffect(() => {
    setBottomwearSizes([...defaultBottomwearSizes, ...customBottomwearSizes]);
  }, [customBottomwearSizes]);

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file upload for size charts
  const handleFileUpload = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      const newChart = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        date: new Date().toLocaleDateString(),
        file: file
      };
      setSizeCharts(prev => [...prev, newChart]);
      setIsAddSizeChartOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file select click
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Download size chart
  const handleDownload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Delete size chart
  const handleDeleteSizeChart = (id) => {
    setSizeCharts(prev => prev.filter(c => c.id !== id));
  };

  // Add custom color to global customColors (persistent, real-time)
  const handleAddCustomColor = () => {
    if (newColorInput.trim() && !availableColors.includes(newColorInput.trim())) {
      const trimmed = newColorInput.trim();
      setCustomColors(prev => [...prev, trimmed]);
      setNewColorInput('');
      setIsAddColorOpen(false);
    }
  };

  // Edit custom color
  const handleEditColor = (oldColor, newColor) => {
    if (newColor.trim() && newColor.trim() !== oldColor) {
      setCustomColors(prev => prev.map(c => c === oldColor ? newColor.trim() : c));
      const tempAvailable = [...availableColors];
      const index = tempAvailable.indexOf(oldColor);
      if (index > -1) {
        tempAvailable[index] = newColor.trim();
        setAvailableColors(tempAvailable);
      }
      setEditingColor(null);
    }
  };

  // Delete custom color
  const handleDeleteColor = (colorToDelete) => {
    if (defaultColors.includes(colorToDelete)) return; // Cannot delete defaults
    setCustomColors(prev => prev.filter(c => c !== colorToDelete));
    setAvailableColors(prev => prev.filter(c => c !== colorToDelete));
  };

  // Add custom size to topwear
  const handleAddCustomTopwearSize = () => {
    if (newTopwearSizeInput.trim() && !topwearSizes.includes(newTopwearSizeInput.trim())) {
      const trimmed = newTopwearSizeInput.trim();
      setCustomTopwearSizes(prev => [...prev, trimmed]);
      setNewTopwearSizeInput('');
      setIsAddTopwearSizeOpen(false);
    }
  };

  // Edit topwear size
  const handleEditTopwearSize = (oldSize, newSize) => {
    if (newSize.trim() && newSize.trim() !== oldSize) {
      setCustomTopwearSizes(prev => prev.map(s => s === oldSize ? newSize.trim() : s));
      const tempAvailable = [...topwearSizes];
      const index = tempAvailable.indexOf(oldSize);
      if (index > -1) {
        tempAvailable[index] = newSize.trim();
        setTopwearSizes(tempAvailable);
      }
      setEditingTopwearSize(null);
    }
  };

  // Delete topwear size
  const handleDeleteTopwearSize = (sizeToDelete) => {
    if (defaultTopwearSizes.includes(sizeToDelete)) return; // Cannot delete predefined
    setCustomTopwearSizes(prev => prev.filter(s => s !== sizeToDelete));
    setTopwearSizes(prev => prev.filter(s => s !== sizeToDelete));
  };

  // Add custom size to bottomwear
  const handleAddCustomBottomwearSize = () => {
    if (newBottomwearSizeInput.trim() && !bottomwearSizes.includes(newBottomwearSizeInput.trim())) {
      const trimmed = newBottomwearSizeInput.trim();
      setCustomBottomwearSizes(prev => [...prev, trimmed]);
      setNewBottomwearSizeInput('');
      setIsAddBottomwearSizeOpen(false);
    }
  };

  // Edit bottomwear size
  const handleEditBottomwearSize = (oldSize, newSize) => {
    if (newSize.trim() && newSize.trim() !== oldSize) {
      setCustomBottomwearSizes(prev => prev.map(s => s === oldSize ? newSize.trim() : s));
      const tempAvailable = [...bottomwearSizes];
      const index = tempAvailable.indexOf(oldSize);
      if (index > -1) {
        tempAvailable[index] = newSize.trim();
        setBottomwearSizes(tempAvailable);
      }
      setEditingBottomwearSize(null);
    }
  };

  // Delete bottomwear size
  const handleDeleteBottomwearSize = (sizeToDelete) => {
    if (defaultBottomwearSizes.includes(sizeToDelete)) return; // Cannot delete predefined
    setCustomBottomwearSizes(prev => prev.filter(s => s !== sizeToDelete));
    setBottomwearSizes(prev => prev.filter(s => s !== sizeToDelete));
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
        <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 px-4 py-2">
              <Plus className="h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Color</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter new color (e.g., Teal)"
                value={newColorInput}
                onChange={(e) => setNewColorInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddColorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomColor} disabled={!newColorInput.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderRow(availableColors, colorSearch, editingColor, setEditingColor, handleEditColor, handleDeleteColor, defaultColors, defaultColors, 'color')}
        </Table>
      </ScrollArea>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Topwear Size</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter new size (e.g., 5XL)"
                value={newTopwearSizeInput}
                onChange={(e) => setNewTopwearSizeInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddTopwearSizeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomTopwearSize} disabled={!newTopwearSizeInput.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderRow(topwearSizes, topwearSearch, editingTopwearSize, setEditingTopwearSize, handleEditTopwearSize, handleDeleteTopwearSize, defaultTopwearSizes, defaultTopwearSizes, 'topwear')}
        </Table>
      </ScrollArea>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bottomwear Size</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter new size (e.g., 42)"
                value={newBottomwearSizeInput}
                onChange={(e) => setNewBottomwearSizeInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddBottomwearSizeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomBottomwearSize} disabled={!newBottomwearSizeInput.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderRow(bottomwearSizes, bottomwearSearch, editingBottomwearSize, setEditingBottomwearSize, handleEditBottomwearSize, handleDeleteBottomwearSize, defaultBottomwearSizes, defaultBottomwearSizes, 'bottomwear')}
        </Table>
      </ScrollArea>
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
        <Dialog open={isAddSizeChartOpen} onOpenChange={setIsAddSizeChartOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 px-4 py-2">
              <Plus className="h-4 w-4" />
              Upload Size Chart
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Upload Size Chart</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                ref={fileInputRef}
              />
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelect}
              >
                <div className="flex flex-col items-center justify-center py-8">
                  <Upload className={`h-8 w-8 mb-2 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-sm font-medium mb-1">Drag & drop your file here, or click to select from your computer</p>
                  <p className={`text-xs mb-4 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    Supports PDF and images (JPG, PNG, etc.)
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddSizeChartOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSizeCharts.map((chart) => (
              <TableRow key={chart.id} className="hover:bg-muted/50 border-b">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>{chart.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {chart.type.includes('pdf') ? 'PDF' : 'Image'}
                  </Badge>
                </TableCell>
                <TableCell>{chart.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleDownload(chart.file)}
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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
            ))}
            {filteredSizeCharts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No size charts found matching "{sizeChartSearch}". Try adjusting your search or upload a new one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
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
    </div>
  );
}