"use client";

import { useState, useEffect } from "react";
import { Plus, X, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VariantTemplateForm from "../../variants/components/VariantTemplateForm";
import type { VariantTemplate } from "../../variants/components/VariantTemplateForm";
import type { Category, Product, ProductVariant, Vendor } from "../types";

interface Props {
  categories: Category[];
  vendors: Vendor[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  onAddVariantTemplate: (categoryId: string, template: VariantTemplate) => void;
}

export default function ProductForm({ categories, vendors, onSave, onCancel, onAddVariantTemplate }: Props) {
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    description: "",
    categoryId: "",
    basePrice: 0,
    sku: "",
    images: [],
    variants: [],
    stock: 0,
    status: "draft"
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      const initialVariants = selectedCategory.variants.map(template => ({
        variantTemplateId: template.id,
        selectedValues: []
      }));
      setProduct(prev => ({ ...prev, variants: initialVariants }));
    }
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setProduct(prev => ({ 
      ...prev, 
      categoryId,
      variants: category?.variants.map(template => ({
        variantTemplateId: template.id,
        selectedValues: []
      })) || []
    }));
  };

  const handleVariantValueChange = (templateId: string, valueId: string, field: string, value: any) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant => {
        if (variant.variantTemplateId !== templateId) return variant;
        
        const existingValue = variant.selectedValues.find(v => v.valueId === valueId);
        if (!existingValue) {
          return {
            ...variant,
            selectedValues: [
              ...variant.selectedValues,
              { valueId, price_adjustment: 0, stock: 0, sku: "", [field]: value }
            ]
          };
        }

        return {
          ...variant,
          selectedValues: variant.selectedValues.map(v => 
            v.valueId === valueId ? { ...v, [field]: value } : v
          )
        };
      })
    }));
  };

  const handleAddVariant = (template: VariantTemplate) => {
    if (selectedCategory) {
      onAddVariantTemplate(selectedCategory.id, template);
      setProduct(prev => ({
        ...prev,
        variants: [
          ...prev.variants,
          { variantTemplateId: template.id, selectedValues: [] }
        ]
      }));
    }
    setIsAddingVariant(false);
  };

  const handleSubmit = () => {
    if (product.name && product.categoryId) {
      onSave(product as Product);
    }
  };

  const renderVariantInput = (template: VariantTemplate) => {
    const variant = product.variants.find(v => v.variantTemplateId === template.id);
    
    switch (template.metadata?.displayType) {
      case 'color':
        return (
          <div className="grid grid-cols-2 gap-4">
            {template.values.map(value => (
              <div 
                key={value.id}
                className="flex items-center space-x-2 p-2 border rounded-lg"
                style={{ backgroundColor: value.metadata?.hex }}
              >
                <input
                  type="checkbox"
                  checked={variant?.selectedValues.some(v => v.valueId === value.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleVariantValueChange(template.id, value.id, 'selected', true);
                    } else {
                      setProduct(prev => ({
                        ...prev,
                        variants: prev.variants.map(v => 
                          v.variantTemplateId === template.id
                            ? {
                                ...v,
                                selectedValues: v.selectedValues.filter(sv => sv.valueId !== value.id)
                              }
                            : v
                        )
                      }));
                    }
                  }}
                />
                <span className="font-medium">{value.value}</span>
                {variant?.selectedValues.some(v => v.valueId === value.id) && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Price +/-"
                      value={variant.selectedValues.find(v => v.valueId === value.id)?.price_adjustment || 0}
                      onChange={(e) => handleVariantValueChange(template.id, value.id, 'price_adjustment', parseFloat(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variant.selectedValues.find(v => v.valueId === value.id)?.stock || 0}
                      onChange={(e) => handleVariantValueChange(template.id, value.id, 'stock', parseInt(e.target.value))}
                    />
                    <Input
                      placeholder="SKU"
                      value={variant.selectedValues.find(v => v.valueId === value.id)?.sku || ''}
                      onChange={(e) => handleVariantValueChange(template.id, value.id, 'sku', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'button':
      case 'radio':
        return (
          <div className="space-y-4">
            {template.values.map(value => (
              <div key={value.id} className="flex items-start space-x-4">
                <input
                  type={template.metadata?.allowMultiple ? "checkbox" : "radio"}
                  name={`variant-${template.id}`}
                  checked={variant?.selectedValues.some(v => v.valueId === value.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleVariantValueChange(template.id, value.id, 'selected', true);
                    } else if (template.metadata?.allowMultiple) {
                      setProduct(prev => ({
                        ...prev,
                        variants: prev.variants.map(v => 
                          v.variantTemplateId === template.id
                            ? {
                                ...v,
                                selectedValues: v.selectedValues.filter(sv => sv.valueId !== value.id)
                              }
                            : v
                        )
                      }));
                    }
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium">{value.value}</div>
                  {value.metadata?.dimensions && (
                    <div className="text-sm text-gray-500">Dimensions: {value.metadata.dimensions}</div>
                  )}
                  {variant?.selectedValues.some(v => v.valueId === value.id) && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Price +/-"
                        value={variant.selectedValues.find(v => v.valueId === value.id)?.price_adjustment || 0}
                        onChange={(e) => handleVariantValueChange(template.id, value.id, 'price_adjustment', parseFloat(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={variant.selectedValues.find(v => v.valueId === value.id)?.stock || 0}
                        onChange={(e) => handleVariantValueChange(template.id, value.id, 'stock', parseInt(e.target.value))}
                      />
                      <Input
                        placeholder="SKU"
                        value={variant.selectedValues.find(v => v.valueId === value.id)?.sku || ''}
                        onChange={(e) => handleVariantValueChange(template.id, value.id, 'sku', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default: // dropdown
        return (
          <div className="space-y-4">
            <Select
              value={variant?.selectedValues[0]?.valueId || ""}
              onValueChange={(valueId) => handleVariantValueChange(template.id, valueId, 'selected', true)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${template.name}`} />
              </SelectTrigger>
              <SelectContent>
                {template.values.map(value => (
                  <SelectItem key={value.id} value={value.id}>
                    {value.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {variant?.selectedValues[0] && (
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Price +/-"
                  value={variant.selectedValues[0].price_adjustment}
                  onChange={(e) => handleVariantValueChange(template.id, variant.selectedValues[0].valueId, 'price_adjustment', parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={variant.selectedValues[0].stock}
                  onChange={(e) => handleVariantValueChange(template.id, variant.selectedValues[0].valueId, 'stock', parseInt(e.target.value))}
                />
                <Input
                  placeholder="SKU"
                  value={variant.selectedValues[0].sku}
                  onChange={(e) => handleVariantValueChange(template.id, variant.selectedValues[0].valueId, 'sku', e.target.value)}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={product.categoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                value={product.basePrice}
                onChange={(e) => setProduct({ ...product, basePrice: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={product.sku}
                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                placeholder="Enter SKU"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants">
          {!selectedCategory ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a category first to manage variants
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Variants</h3>
                <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add New Variant
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Variant Template</DialogTitle>
                    </DialogHeader>
                    <VariantTemplateForm
                      onSave={handleAddVariant}
                      onCancel={() => setIsAddingVariant(false)}
                      isQuickAdd
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-6">
                {selectedCategory.variants.map(template => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant={template.metadata?.required ? "default" : "secondary"}>
                        {template.metadata?.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                    {renderVariantInput(template)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL"
              />
              <Button 
                onClick={() => {
                  if (newImage) {
                    setProduct(prev => ({
                      ...prev,
                      images: [...prev.images, newImage]
                    }));
                    setNewImage("");
                  }
                }}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setProduct(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Product</Button>
      </div>
    </div>
  );
}