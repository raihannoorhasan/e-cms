"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  Tag,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const mockVariantTemplates = [
  {
    id: 1,
    name: "Clothing Sizes",
    type: "size",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
    usedBy: 45,
    lastUpdated: "2024-03-20",
  },
  {
    id: 2,
    name: "Perfume Volumes",
    type: "volume",
    values: ["30ml", "50ml", "100ml", "200ml"],
    usedBy: 12,
    lastUpdated: "2024-03-19",
  },
  {
    id: 3,
    name: "Basic Colors",
    type: "color",
    values: ["Black", "White", "Red", "Blue", "Green"],
    usedBy: 78,
    lastUpdated: "2024-03-18",
  },
  {
    id: 4,
    name: "Cup Set Quantities",
    type: "quantity",
    values: ["2-Piece", "4-Piece", "6-Piece", "8-Piece"],
    usedBy: 8,
    lastUpdated: "2024-03-17",
  },
];

export default function VariantsPage() {
  const [templates] = useState(mockVariantTemplates);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Variant Templates</h1>
          <p className="text-gray-500">Manage product variant templates</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-9" placeholder="Search templates..." />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {template.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Template
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Type: {template.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.values.map((value, index) => (
                    <Badge key={index} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                  <span>Used by {template.usedBy} products</span>
                  <span>Updated {template.lastUpdated}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}