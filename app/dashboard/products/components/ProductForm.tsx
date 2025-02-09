"use client";

import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import ProductVariantsForm from "./ProductVariantsForm";
import { ProductVariant } from "../types";

interface Category {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    type: string;
    values: string[];
  }[];
}

interface Vendor {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  vendors: Vendor[];
  onSave: (product: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ categories, vendors, onSave, onCancel }: Props) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    base_price: "",
    category_id: "",
    vendor_id: "",
    images: [] as string[],
    has_variants: false,
    variants: [] as ProductVariant[],
    sku: "",
    stock: "",
  });

  const [newImage, setNewImage] = useState("");
  const selectedCategory = categories.find((c) => c.id === product.category_id);

  const handleImageAdd = () => {
    if (newImage.trim() && !product.images.includes(newImage.trim())) {
      setProduct({
        ...product,
        images: [...product.images, newImage.trim()],
      });
      setNewImage("");
    }
  };

  const handleImageRemove = (image: string) => {
    setProduct({
      ...product,
      images: product.images.filter((img) => img !== image),
    });
  };

  const handleVariantsChange = (variants: ProductVariant[]) => {
    setProduct({
      ...product,
      variants,
      has_variants: variants.length > 0,
    });
  };

  const handleSubmit = () => {
    // Validate and submit
    if (
      product.name &&
      product.description &&
      product.base_price &&
      product.category_id &&
      product.vendor_id
    ) {
      onSave(product);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={product.sku}
            onChange={(e) =>
              setProduct({ ...product, sku: e.target.value })
            }
            placeholder="Enter SKU"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Base Price</Label>
          <Input
            id="price"
            type="number"
            value={product.base_price}
            onChange={(e) =>
              setProduct({ ...product, base_price: e.target.value })
            }
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={product.stock}
            onChange={(e) =>
              setProduct({ ...product, stock: e.target.value })
            }
            placeholder="0"
            disabled={product.has_variants}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={product.category_id}
            onValueChange={(value) =>
              setProduct({
                ...product,
                category_id: value,
                variants: [], // Reset variants when category changes
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Select
            value={product.vendor_id}
            onValueChange={(value) =>
              setProduct({ ...product, vendor_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Enter product description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Enter image URL"
          />
          <Button onClick={handleImageAdd}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {product.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => handleImageRemove(image)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && selectedCategory.variants.length > 0 && (
        <div className="space-y-2">
          <Label>Product Variants</Label>
          <ProductVariantsForm
            variants={product.variants}
            onChange={handleVariantsChange}
            availableVariants={selectedCategory.variants}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Product</Button>
      </div>
    </div>
  );
}