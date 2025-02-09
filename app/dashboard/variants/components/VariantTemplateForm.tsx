"use client";

import { useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export type VariantType = 'size' | 'color' | 'volume' | 'material' | 'custom';

export interface VariantTemplate {
  name: string;
  type: VariantType;
  values: string[];
  categories: string[];
}

interface Props {
  onSave: (template: VariantTemplate) => void;
  onCancel: () => void;
  categories: { id: string; name: string }[];
}

export default function VariantTemplateForm({ onSave, onCancel, categories }: Props) {
  const [template, setTemplate] = useState<VariantTemplate>({
    name: "",
    type: "size",
    values: [],
    categories: [],
  });
  const [newValue, setNewValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const addValue = () => {
    if (newValue.trim() && !template.values.includes(newValue.trim())) {
      setTemplate({
        ...template,
        values: [...template.values, newValue.trim()],
      });
      setNewValue("");
    }
  };

  const removeValue = (value: string) => {
    setTemplate({
      ...template,
      values: template.values.filter((v) => v !== value),
    });
  };

  const addCategory = () => {
    if (selectedCategory && !template.categories.includes(selectedCategory)) {
      setTemplate({
        ...template,
        categories: [...template.categories, selectedCategory],
      });
      setSelectedCategory("");
    }
  };

  const removeCategory = (categoryId: string) => {
    setTemplate({
      ...template,
      categories: template.categories.filter((id) => id !== categoryId),
    });
  };

  const handleSubmit = () => {
    if (template.name && template.type && template.values.length > 0) {
      onSave(template);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={template.name}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            placeholder="e.g., Clothing Sizes"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Variant Type</Label>
          <Select
            value={template.type}
            onValueChange={(value: VariantType) =>
              setTemplate({ ...template, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Values</Label>
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Add value"
            onKeyPress={(e) => e.key === "Enter" && addValue()}
          />
          <Button onClick={addValue}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {template.values.map((value) => (
            <Badge key={value} variant="secondary" className="px-2 py-1">
              {value}
              <button
                onClick={() => removeValue(value)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assign Categories</Label>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          <Button onClick={addCategory}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {template.categories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return (
              <Badge key={categoryId} variant="secondary" className="px-2 py-1">
                {category?.name}
                <button
                  onClick={() => removeCategory(categoryId)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" /> Save Template
        </Button>
      </div>
    </div>
  );
}