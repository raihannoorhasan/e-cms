"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockInventory = [
  {
    id: 1,
    name: "Premium T-Shirt",
    sku: "TS-001",
    category: "Apparel",
    totalStock: 150,
    variants: [
      { name: "Small / Black", stock: 50 },
      { name: "Medium / Black", stock: 45 },
      { name: "Large / Black", stock: 55 },
    ],
    lowStockThreshold: 20,
    lastUpdated: "2024-03-20",
  },
  {
    id: 2,
    name: "Luxury Perfume",
    sku: "PF-001",
    category: "Fragrances",
    totalStock: 75,
    variants: [
      { name: "50ml", stock: 30 },
      { name: "100ml", stock: 25 },
      { name: "200ml", stock: 20 },
    ],
    lowStockThreshold: 15,
    lastUpdated: "2024-03-19",
  },
  {
    id: 3,
    name: "Tea Cup Set",
    sku: "TC-001",
    category: "Home & Kitchen",
    totalStock: 40,
    variants: [
      { name: "2-Piece Set", stock: 15 },
      { name: "4-Piece Set", stock: 15 },
      { name: "6-Piece Set", stock: 10 },
    ],
    lowStockThreshold: 10,
    lastUpdated: "2024-03-18",
  },
];

export default function InventoryPage() {
  const [inventory] = useState(mockInventory);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Track and manage your product stock</p>
        </div>
        <Button>
          <RefreshCcw className="mr-2 h-4 w-4" /> Sync Inventory
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">265</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +12 this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-sm text-red-500">
                <ArrowUpRight className="inline h-4 w-4" /> +3 this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <RefreshCcw className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Stock Updates</p>
              <h3 className="text-2xl font-bold">24</h3>
              <p className="text-sm text-green-500">Last 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-9" placeholder="Search inventory..." />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="fragrances">Fragrances</SelectItem>
              <SelectItem value="home">Home & Kitchen</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.totalStock}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.variants.map((variant, index) => (
                        <div key={index} className="text-sm">
                          {variant.name}:{" "}
                          <span
                            className={
                              variant.stock <= item.lowStockThreshold
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
                            {variant.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.totalStock > item.lowStockThreshold
                          ? "default"
                          : "destructive"
                      }
                    >
                      {item.totalStock > item.lowStockThreshold
                        ? "In Stock"
                        : "Low Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}