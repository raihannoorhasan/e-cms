"use client";

import { useState } from "react";
import { Image as ImageIcon, Save, X, Plus, Settings2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryFormData } from "../types";
import VariantTemplateForm, { VariantTemplate } from "../../variants/components/VariantTemplateForm";

interface Props {
  onSave: (data: CategoryFormData & { variants: VariantTemplate[] }) => void;
  onCancel: () => void;
  initialData?: CategoryFormData & { variants?: VariantTemplate[] };
}

export default function CategoryForm({ onSave, onCancel, initialData }: Props) {
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      name: "",
      description: "",
      image: "",
      status: "active",
    }
  );

  const [variants, setVariants] = useState<VariantTemplate[]>(initialData?.variants || []);
  const [imagePreview, setImagePreview] = useState(formData.image);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleAddVariant = (template: VariantTemplate) => {
    setVariants([...variants, template]);
    setIsAddingVariant(false);
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
  };

  const handleSubmit = () => {
    if (formData.name) {
      onSave({ ...formData, variants });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter category description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleImageChange(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              {imagePreview && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleImageChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    onError={() => setImagePreview("")}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-video w-full max-w-sm rounded-lg border bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Variant Templates</h3>
              <p className="text-sm text-muted-foreground">
                Define the available options for products in this category
              </p>
            </div>
            <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Variant Template</DialogTitle>
                </DialogHeader>
                <VariantTemplateForm
                  onSave={handleAddVariant}
                  onCancel={() => setIsAddingVariant(false)}
                  isQuickAdd
                />
              </DialogContent>
            </Dialog>
          </div>

          {variants.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50">
              <Settings2 className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Variants Added</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                Add variant templates to define the available options for products in this category
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddingVariant(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Variant
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{variant.name}</h4>
                      <Badge variant={variant.metadata?.required ? "default" : "secondary"}>
                        {variant.metadata?.required ? "Required" : "Optional"}
                      </Badge>
                      {variant.metadata?.allowMultiple && (
                        <Badge variant="secondary">Multiple</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {variant.values.map((value) => (
                        <Badge key={value.id} variant="outline">
                          {value.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVariant(variant.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.name}>
          <Save className="mr-2 h-4 w-4" /> Save Category
        </Button>
      </div>
    </div>
  );
}