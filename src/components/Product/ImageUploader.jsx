// src/components/Product/ImageUploader.jsx
import { useState, useRef, useEffect } from "react";
import { Upload, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ImageUploader = ({ initialImages = [], onImagesChange }) => {
  const [images, setImages] = useState(initialImages.map(url => ({ url, isFile: false })));
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    onImagesChange(images.map(img => img.url).join(','));
  }, [images, onImagesChange]);

  const processFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, { url: e.target.result, isFile: true }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleSelect = (e) => {
    processFiles(e.target.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (dropRef.current) {
      dropRef.current.addEventListener('dragover', handleDragOver);
      dropRef.current.addEventListener('dragleave', handleDragLeave);
      dropRef.current.addEventListener('drop', handleDrop);
      return () => {
        dropRef.current?.removeEventListener('dragover', handleDragOver);
        dropRef.current?.removeEventListener('dragleave', handleDragLeave);
        dropRef.current?.removeEventListener('drop', handleDrop);
      };
    }
  }, []);

  return (
    <div className="space-y-4 col-span-full">
      <Label className="text-xs md:text-sm font-medium text-muted-foreground">
        Images (Drag & drop or select from computer)
      </Label>
      <div
        ref={dropRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-muted'
        }`}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">Drag & drop images here, or click to select</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm"
        >
          Select Images
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => removeImage(index)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;