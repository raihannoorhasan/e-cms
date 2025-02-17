"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, FolderTree, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CategoryForm from "./components/CategoryForm";
import type { Category } from "./types";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    slug: "electronics",
    status: "active",
    variants: [
      {
        id: "size-1",
        name: "Storage Options",
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
      },
      {
        id: "color-1",
        name: "Colors",
        values: [
          { id: "black", value: "Black", metadata: { hex: "#000000" } },
          { id: "silver", value: "Silver", metadata: { hex: "#C0C0C0" } },
          { id: "gold", value: "Gold", metadata: { hex: "#FFD700" } }
        ],
        metadata: {
          displayType: "color",
          required: true,
          allowMultiple: false
        }
      }
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Fashion",
    description: "Clothing, shoes, and accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
    slug: "fashion",
    status: "active",
    variants: [
      {
        id: "size-2",
        name: "Clothing Sizes",
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
      }
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z"
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveCategory = (formData: any) => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...editingCategory,
                ...formData,
                variants: formData.variants,
                updatedAt: new Date().toISOString(),
              }
            : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        variants: formData.variants || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
    setIsAddDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage your product categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSave={handleSaveCategory}
              onCancel={() => {
                setIsAddDialogOpen(false);
                setEditingCategory(null);
              }}
              initialData={editingCategory || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-9"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.image ? (
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {category.variants.map((variant) => (
                      <Badge key={variant.id} variant="secondary">
                        {variant.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={category.status === "active" ? "default" : "secondary"}
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}