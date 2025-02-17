"use client";

import { useState, useEffect } from "react";
import { Plus, X, Upload, AlertCircle, Eye, ImageIcon } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Product, ProductVariant } from "../types";
import type { VariantTemplate } from "../../variants/components/VariantTemplateForm";

interface Props {
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  initialData?: Product;
}

export default function ProductForm({ categories, onSave, onCancel, initialData }: Props) {
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    description: "",
    categoryId: "",
    basePrice: 0,
    sku: "",
    images: [],
    variants: [],
    stock: 0,
    status: "draft",
    ...(initialData || {})
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [newImage, setNewImage] = useState("");
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [variantStockMap, setVariantStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (product.categoryId) {
      const category = categories.find(c => c.id === product.categoryId);
      setSelectedCategory(category || null);
    }
  }, [product.categoryId, categories]);

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

    // Update variant stock map
    if (field === 'stock') {
      setVariantStockMap(prev => ({
        ...prev,
        [`${templateId}-${valueId}`]: value
      }));
    }
  };

  const calculateTotalStock = () => {
    if (!selectedCategory || !product.variants.length) return 0;

    let totalStock = 0;
    const variantCombinations = generateVariantCombinations();
    
    variantCombinations.forEach(combination => {
      const stockValues = combination.map(({ templateId, valueId }) => 
        variantStockMap[`${templateId}-${valueId}`] || 0
      );
      totalStock += Math.min(...stockValues);
    });

    return totalStock;
  };

  const generateVariantCombinations = () => {
    if (!selectedCategory) return [];

    const variants = product.variants;
    const combinations: Array<Array<{ templateId: string; valueId: string }>> = [];

    const generateCombination = (current: Array<{ templateId: string; valueId: string }>, index: number) => {
      if (index === variants.length) {
        combinations.push([...current]);
        return;
      }

      const variant = variants[index];
      variant.selectedValues.forEach(value => {
        generateCombination([...current, { templateId: variant.variantTemplateId, valueId: value.valueId }], index + 1);
      });
    };

    generateCombination([], 0);
    return combinations;
  };

  const handleImageUpload = () => {
    if (newImage && !product.images.includes(newImage)) {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    if (index === thumbnailIndex) {
      setThumbnailIndex(0);
    } else if (index < thumbnailIndex) {
      setThumbnailIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (product.name && product.categoryId) {
      const totalStock = calculateTotalStock();
      onSave({
        ...product,
        stock: totalStock,
      } as Product);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants & Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Add and manage product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                <Button onClick={handleImageUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Add Image
                </Button>
              </div>

              {product.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className={`relative aspect-square rounded-lg overflow-hidden border-2 ${index === thumbnailIndex ? 'border-primary' : 'border-border'}`}>
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setThumbnailIndex(index)}
                          >
                            Set as Thumbnail
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index === thumbnailIndex && (
                        <Badge className="absolute top-2 left-2">Thumbnail</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Images Added</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                    Add product images to showcase your product
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          {!selectedCategory ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a category first to manage variants and stock
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {selectedCategory.variants.map(template => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>
                          Select available options and set stock levels
                        </CardDescription>
                      </div>
                      <Badge variant={template.metadata?.required ? "default" : "secondary"}>
                        {template.metadata?.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {template.values.map(value => (
                        <div
                          key={value.id}
                          className="flex flex-col space-y-2 p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={product.variants
                                  .find(v => v.variantTemplateId === template.id)
                                  ?.selectedValues.some(sv => sv.valueId === value.id)
                                }
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
                                className="rounded border-gray-300"
                              />
                              <span className="font-medium">{value.value}</span>
                            </div>
                            {template.metadata?.displayType === 'color' && value.metadata?.hex && (
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: value.metadata.hex }}
                              />
                            )}
                          </div>

                          {product.variants
                            .find(v => v.variantTemplateId === template.id)
                            ?.selectedValues.some(sv => sv.valueId === value.id) && (
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <div className="space-y-1">
                                <Label>Price Adjustment</Label>
                                <Input
                                  type="number"
                                  placeholder="+/- Price"
                                  value={product.variants
                                    .find(v => v.variantTemplateId === template.id)
                                    ?.selectedValues.find(sv => sv.valueId === value.id)
                                    ?.price_adjustment || 0
                                  }
                                  onChange={(e) => handleVariantValueChange(
                                    template.id,
                                    value.id,
                                    'price_adjustment',
                                    parseFloat(e.target.value)
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  placeholder="Stock"
                                  value={product.variants
                                    .find(v => v.variantTemplateId === template.id)
                                    ?.selectedValues.find(sv => sv.valueId === value.id)
                                    ?.stock || 0
                                  }
                                  onChange={(e) => handleVariantValueChange(
                                    template.id,
                                    value.id,
                                    'stock',
                                    parseInt(e.target.value)
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label>SKU</Label>
                                <Input
                                  placeholder="Variant SKU"
                                  value={product.variants
                                    .find(v => v.variantTemplateId === template.id)
                                    ?.selectedValues.find(sv => sv.valueId === value.id)
                                    ?.sku || ''
                                  }
                                  onChange={(e) => handleVariantValueChange(
                                    template.id,
                                    value.id,
                                    'sku',
                                    e.target.value
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Stock Summary</CardTitle>
                  <CardDescription>Total available stock across all variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateTotalStock()} units</div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!product.name || !product.categoryId || product.images.length === 0}
        >
          Save Product
        </Button>
      </div>
    </div>
  );
}