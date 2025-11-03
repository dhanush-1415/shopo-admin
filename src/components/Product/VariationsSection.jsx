// src/components/Product/VariationsSection.jsx
import { Tag, Trash2 } from 'lucide-react';
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
import { colors } from './productsData';

const VariationsSection = ({ 
  variations, setVariations, 
  selectedColor, setSelectedColor, 
  selectedSizes, setSelectedSizes, 
  variationStocks, setVariationStocks,
  availableSizes, finalCategory,
  toggleSize, addVariation, editStock, deleteVariation,
  prefix = '' 
}) => (
  <div className="space-y-4 col-span-full">
    <h4 className="text-md font-semibold flex items-center gap-2">
      <Tag className="h-4 w-4" />
      Variations for {finalCategory}
    </h4>
    <div className="rounded-xl p-4 shadow-sm border hover:bg-gray-50 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-muted-foreground">
            Color
          </Label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
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

export default VariationsSection;