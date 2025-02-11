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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import VariantTemplateForm, { VariantTemplate } from "./components/VariantTemplateForm";

const mockVariantTemplates: VariantTemplate[] = [
  {
    id: "1",
    name: "Clothing Sizes",
    type: "size",
    values: [
      { id: "1", value: "XS", metadata: { dimensions: "32x24" } },
      { id: "2", value: "S", metadata: { dimensions: "34x26" } },
      { id: "3", value: "M", metadata: { dimensions: "36x28" } },
      { id: "4", value: "L", metadata: { dimensions: "38x30" } },
      { id: "5", value: "XL", metadata: { dimensions: "40x32" } },
      { id: "6", value: "XXL", metadata: { dimensions: "42x34" } }
    ],
    metadata: {
      displayType: "dropdown",
      required: true,
      allowMultiple: false
    }
  },
  {
    id: "2",
    name: "Basic Colors",
    type: "color",
    values: [
      { id: "1", value: "Black", metadata: { hex: "#000000" } },
      { id: "2", value: "White", metadata: { hex: "#FFFFFF" } },
      { id: "3", value: "Red", metadata: { hex: "#FF0000" } },
      { id: "4", value: "Blue", metadata: { hex: "#0000FF" } },
      { id: "5", value: "Green", metadata: { hex: "#00FF00" } }
    ],
    metadata: {
      displayType: "color",
      required: true,
      allowMultiple: false
    }
  },
  {
    id: "3",
    name: "Fabric Materials",
    type: "material",
    values: [
      { id: "1", value: "Cotton", metadata: { weight: "150g/m²" } },
      { id: "2", value: "Polyester", metadata: { weight: "120g/m²" } },
      { id: "3", value: "Wool", metadata: { weight: "200g/m²" } },
      { id: "4", value: "Silk", metadata: { weight: "80g/m²" } }
    ],
    metadata: {
      displayType: "radio",
      required: true,
      allowMultiple: false
    }
  }
];

export default function VariantsPage() {
  const [templates, setTemplates] = useState<VariantTemplate[]>(mockVariantTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VariantTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleSaveTemplate = (template: VariantTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }
    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Variant Templates</h1>
          <p className="text-gray-500">Manage product variant templates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTemplate(null)}>
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Create New Template"}
              </DialogTitle>
            </DialogHeader>
            <VariantTemplateForm
              onSave={handleSaveTemplate}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingTemplate(null);
              }}
              existingTemplate={editingTemplate || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input 
            className="pl-9" 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
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
                  <DropdownMenuItem onClick={() => {
                    setEditingTemplate(template);
                    setIsDialogOpen(true);
                  }}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Template
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
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
                  {template.values.map((value) => (
                    <Badge 
                      key={value.id} 
                      variant="secondary"
                      style={value.metadata?.hex ? { backgroundColor: value.metadata.hex } : undefined}
                    >
                      {value.value}
                      {value.metadata?.dimensions && ` (${value.metadata.dimensions})`}
                      {value.metadata?.weight && ` (${value.metadata.weight})`}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                  <span>Display: {template.metadata?.displayType}</span>
                  <span>{template.metadata?.required ? "Required" : "Optional"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}