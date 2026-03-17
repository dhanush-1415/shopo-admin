// src/components/Product/VariationsSection.jsx
import { useState, useEffect } from 'react';
import { Tag, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getAllColors, createColor } from '@/api/services/colorService';
import { useAuthStore } from '@/store/authStore';

const VariationsSection = ({ 
  variations, setVariations, 
  selectedColor, setSelectedColor, 
  selectedSizes, setSelectedSizes, 
  variationStocks, setVariationStocks,
  availableSizes, finalCategory,
  toggleSize, addVariation, editStock, deleteVariation,
  prefix = '' 
}) => {
  const { getToken } = useAuthStore();
  const [colors, setColors] = useState([]);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [isCreateColorOpen, setIsCreateColorOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [isCreatingColor, setIsCreatingColor] = useState(false);

  // Fetch colors from API
  useEffect(() => {
    const fetchColors = async () => {
      setIsLoadingColors(true);
      try {
        const token = getToken();
        const response = await getAllColors(token);
        
        if (response.success) {
          // Extract color names from API response
          const colorNames = response.data.map(color => 
            color.color || color.name || color
          );
          setColors(colorNames);
        } else {
          toast.error(response.error || 'Failed to load colors');
        }
      } catch (error) {
        console.error('Failed to fetch colors:', error);
        toast.error('Failed to load colors');
      } finally {
        setIsLoadingColors(false);
      }
    };

    fetchColors();
  }, [getToken]);

  // Handle create new color
  const handleCreateColor = async () => {
    if (!newColorName.trim()) {
      toast.error('Please enter a color name');
      return;
    }

    setIsCreatingColor(true);
    try {
      const token = getToken();
      const response = await createColor({ color: newColorName.trim() }, token);

      if (response.success) {
        // Add new color to the list
        const newColor = response.data?.color || response.data?.data?.color || newColorName.trim();
        setColors(prev => [...prev, newColor]);
        setSelectedColor(newColor);
        setNewColorName('');
        setIsCreateColorOpen(false);
        toast.success('Color created successfully!');
      } else {
        toast.error(response.error || 'Failed to create color');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create color');
    } finally {
      setIsCreatingColor(false);
    }
  };

  return (
  <div className="space-y-4 col-span-full">
    <h4 className="text-md font-semibold flex items-center gap-2">
      <Tag className="h-4 w-4" />
      Variations for {finalCategory}
    </h4>
    <div className="rounded-xl p-4 shadow-sm border hover:bg-gray-50 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
          <Label className="text-xs md:text-sm font-medium text-muted-foreground">
            Color
          </Label>
            <Dialog open={isCreateColorOpen} onOpenChange={setIsCreateColorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Color
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Color</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="color-name">Color Name</Label>
                    <Input
                      id="color-name"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g., Red, Blue, Green"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateColor();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateColorOpen(false);
                      setNewColorName('');
                    }}
                    disabled={isCreatingColor}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateColor} disabled={isCreatingColor || !newColorName.trim()}>
                    {isCreatingColor ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Color'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Select value={selectedColor} onValueChange={setSelectedColor} disabled={isLoadingColors}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder={isLoadingColors ? "Loading colors..." : "Select color"} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingColors ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading colors...
                  </div>
                </SelectItem>
              ) : colors.length > 0 ? (
                colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-colors" disabled>
                  No colors available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-muted-foreground">
            Sizes
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`${prefix}-size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => toggleSize(size, checked)}
                />
                <Label htmlFor={`${prefix}-size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
          {selectedSizes.length === 0 && availableSizes.length > 0 && (
            <p className="text-xs text-muted-foreground">Select sizes for this category</p>
          )}
        </div>
      </div>
      {selectedSizes.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-muted-foreground">
            Stock Quantities
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedSizes.map((size) => (
              <div key={size} className="space-y-1">
                <Label className="text-xs">{size}</Label>
                <Input
                  type="number"
                  value={variationStocks[size] || 0}
                  onChange={(e) => setVariationStocks({ ...variationStocks, [size]: parseInt(e.target.value) || 0 })}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <Button onClick={addVariation} className="w-full" disabled={!selectedColor || selectedSizes.length === 0 || !finalCategory}>
        Add Variation
      </Button>
      {variations.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-muted-foreground">
            Added Variations
          </Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variations.map((variation, index) => (
                <TableRow key={index}>
                  <TableCell>{variation.color}</TableCell>
                  <TableCell>{variation.size}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={variation.stock}
                      onChange={(e) => editStock(index, e.target.value)}
                      className="h-8 w-20 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteVariation(index)}>
                      <Trash2 className="h-4 w-4" /> {/* Assuming Trash2 is imported */}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  </div>
);
};

export default VariationsSection;