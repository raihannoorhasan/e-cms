"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductForm from "./components/ProductForm";
import type { Category } from "./types";
import type { VariantTemplate } from "../variants/components/VariantTemplateForm";

// Shared mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Clothing",
    variants: [
      {
        id: "size-1",
        name: "Clothing Sizes",
        type: "size",
        values: [
          { id: "xs", value: "XS", metadata: { dimensions: "32x24" } },
          { id: "s", value: "S", metadata: { dimensions: "34x26" } },
          { id: "m", value: "M", metadata: { dimensions: "36x28" } },
          { id: "l", value: "L", metadata: { dimensions: "38x30" } },
          { id: "xl", value: "XL", metadata: { dimensions: "40x32" } }
        ],
        metadata: {
          displayType: "button",
          required: true,
          allowMultiple: false
        }
      },
      {
        id: "color-1",
        name: "Basic Colors",
        type: "color",
        values: [
          { id: "black", value: "Black", metadata: { hex: "#000000" } },
          { id: "white", value: "White", metadata: { hex: "#FFFFFF" } },
          { id: "red", value: "Red", metadata: { hex: "#FF0000" } },
          { id: "blue", value: "Blue", metadata: { hex: "#0000FF" } }
        ],
        metadata: {
          displayType: "color",
          required: true,
          allowMultiple: false
        }
      }
    ]
  },
  {
    id: "2",
    name: "Electronics",
    variants: [
      {
        id: "storage-1",
        name: "Storage Options",
        type: "custom",
        values: [
          { id: "64", value: "64GB", metadata: {} },
          { id: "128", value: "128GB", metadata: {} },
          { id: "256", value: "256GB", metadata: {} }
        ],
        metadata: {
          displayType: "button",
          required: true,
          allowMultiple: false
        }
      }
    ]
  }
];

const mockVendors = [
  { id: "1", name: "TechPro Solutions" },
  { id: "2", name: "EcoWear Fashion" },
];

const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    price: 199.99,
    stock: 45,
    category: "Electronics",
    vendor: "TechPro",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
    price: 29.99,
    stock: 120,
    category: "Fashion",
    vendor: "EcoWear",
    status: "In Stock",
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=300&q=80",
    price: 159.99,
    stock: 0,
    category: "Electronics",
    vendor: "SmartTech",
    status: "Out of Stock",
  },
];

export default function ProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [products, setProducts] = useState(mockProducts);

  const handleSaveProduct = (product: any) => {
    console.log("Saving product:", product);
    setIsAddDialogOpen(false);
  };

  const handleAddVariantTemplate = (categoryId: string, template: VariantTemplate) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId
          ? { ...category, variants: [...category.variants, template] }
          : category
      )
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesVendor =
      vendorFilter === "all" || product.vendor === vendorFilter;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              categories={categories}
              vendors={mockVendors}
              onSave={handleSaveProduct}
              onCancel={() => setIsAddDialogOpen(false)}
              onAddVariantTemplate={handleAddVariantTemplate}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-9"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
            </SelectContent>
          </Select>
          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="TechPro">TechPro</SelectItem>
              <SelectItem value="EcoWear">EcoWear</SelectItem>
              <SelectItem value="SmartTech">SmartTech</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{product.name}</span>
                <span className="text-lg font-bold">${product.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span className="flex items-center">
                  <Tags className="mr-1 h-4 w-4" /> {product.category}
                </span>
                <span>{product.vendor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    product.status === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}