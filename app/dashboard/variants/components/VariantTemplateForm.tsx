"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle, Eye, Palette, Settings2, Boxes, ArrowRight } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type VariantType = 'size' | 'color' | 'volume' | 'material' | 'custom';

export interface VariantValue {
  id: string;
  value: string;
  metadata?: {
    hex?: string;
    dimensions?: string;
    weight?: string;
    image?: string;
    surcharge?: number;
    minQuantity?: number;
    maxQuantity?: number;
  };
}

export interface VariantTemplate {
  id: string;
  name: string;
  type: VariantType;
  values: VariantValue[];
  metadata?: {
    displayType?: 'dropdown' | 'color' | 'button' | 'radio';
    required?: boolean;
    allowMultiple?: boolean;
    defaultValue?: string;
    description?: string;
    sortOrder?: number;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
    };
  };
}

interface Props {
  onSave: (template: VariantTemplate) => void;
  onCancel: () => void;
  existingTemplate?: VariantTemplate;
  isQuickAdd?: boolean;
}

const VARIANT_TYPE_INFO = {
  size: {
    icon: Boxes,
    description: "Product dimensions, clothing sizes, etc.",
    examples: ["XS", "S", "M", "L", "XL", "32x32", "EU 42"],
  },
  color: {
    icon: Palette,
    description: "Colors with hex values and optional images",
    examples: ["Red", "Navy Blue", "Forest Green"],
  },
  volume: {
    icon: Settings2,
    description: "Capacity, weight, or volume measurements",
    examples: ["500ml", "1L", "2.5kg", "100g"],
  },
  material: {
    icon: Settings2,
    description: "Material types with optional properties",
    examples: ["Cotton", "Leather", "Stainless Steel"],
  },
  custom: {
    icon: Settings2,
    description: "Custom variant type for special cases",
    examples: ["Option A", "Option B", "Custom Value"],
  },
};

const VariantTemplateForm = ({ onSave, onCancel, existingTemplate, isQuickAdd }: Props) => {
  const [template, setTemplate] = useState<VariantTemplate>(
    existingTemplate || {
      id: crypto.randomUUID(),
      name: "",
      type: "custom",
      values: [],
      metadata: {
        displayType: 'dropdown',
        required: true,
        allowMultiple: false,
        description: "",
      },
    }
  );

  const [newValue, setNewValue] = useState("");
  const [newMetadata, setNewMetadata] = useState<VariantValue["metadata"]>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);

  const addValue = () => {
    if (newValue.trim()) {
      const value: VariantValue = {
        id: crypto.randomUUID(),
        value: newValue.trim(),
        metadata: { ...newMetadata },
      };

      setTemplate({
        ...template,
        values: [...template.values, value],
      });
      setNewValue("");
      setNewMetadata({});
    }
  };

  const removeValue = (id: string) => {
    setTemplate({
      ...template,
      values: template.values.filter((v) => v.id !== id),
    });
  };

  const handleSubmit = () => {
    if (template.name && template.values.length > 0) {
      onSave(template);
    }
  };

  const renderPreview = () => {
    switch (template.metadata?.displayType) {
      case 'color':
        return (
          <div className="grid grid-cols-6 gap-2">
            {template.values.map((value) => (
              <div
                key={value.id}
                className="relative group cursor-pointer"
                style={{ aspectRatio: "1" }}
              >
                <div
                  className="w-full h-full rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                  style={{ backgroundColor: value.metadata?.hex }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                  <span className="text-white text-xs">{value.value}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'button':
        return (
          <div className="flex flex-wrap gap-2">
            {template.values.map((value) => (
              <Button
                key={value.id}
                variant="outline"
                className="h-9"
              >
                {value.value}
                {value.metadata?.dimensions && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({value.metadata.dimensions})
                  </span>
                )}
              </Button>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {template.values.map((value) => (
              <label
                key={value.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="preview"
                  className="w-4 h-4"
                />
                <span>{value.value}</span>
                {value.metadata?.surcharge && (
                  <span className="text-sm text-muted-foreground">
                    (+${value.metadata.surcharge})
                  </span>
                )}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${template.name}`} />
            </SelectTrigger>
            <SelectContent>
              {template.values.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
    }
  };

  return (
    <div className="space-y-6">
      {isQuickAdd && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Quick adding a variant template. This will be available for all categories after creation.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle preview mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your variant template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    placeholder="e.g., T-Shirt Sizes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Variant Type</Label>
                  <Select
                    value={template.type}
                    onValueChange={(value: VariantType) =>
                      setTemplate({ 
                        ...template, 
                        type: value,
                        metadata: {
                          ...template.metadata,
                          displayType: value === 'color' ? 'color' : 'dropdown'
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VARIANT_TYPE_INFO).map(([type, info]) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center">
                            <info.icon className="w-4 h-4 mr-2" />
                            <span className="capitalize">{type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={template.metadata?.description || ""}
                  onChange={(e) =>
                    setTemplate({
                      ...template,
                      metadata: { ...template.metadata, description: e.target.value }
                    })
                  }
                  placeholder="Enter a description for this variant template"
                />
              </div>

              {VARIANT_TYPE_INFO[template.type] && (
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <VARIANT_TYPE_INFO[template.type].icon className="w-4 h-4" />
                    <span className="font-medium">{template.type.charAt(0).toUpperCase() + template.type.slice(1)} Type</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {VARIANT_TYPE_INFO[template.type].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {VARIANT_TYPE_INFO[template.type].examples.map((example) => (
                      <Badge key={example} variant="secondary">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle>Variant Values</CardTitle>
              <CardDescription>
                Add and configure the possible values for this variant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Add value"
                    onKeyPress={(e) => e.key === "Enter" && addValue()}
                  />
                </div>

                {template.type === 'color' && (
                  <div className="w-24">
                    <Input
                      type="color"
                      value={newMetadata.hex || "#000000"}
                      onChange={(e) => setNewMetadata({ ...newMetadata, hex: e.target.value })}
                      className="h-9 p-1"
                    />
                  </div>
                )}

                {template.type === 'size' && (
                  <div className="w-40">
                    <Input
                      placeholder="Dimensions"
                      value={newMetadata.dimensions || ""}
                      onChange={(e) => setNewMetadata({ ...newMetadata, dimensions: e.target.value })}
                    />
                  </div>
                )}

                <Button onClick={addValue}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {template.values.map((value) => (
                  <div
                    key={value.id}
                    className="flex items-center justify-between p-2 rounded-lg border group hover:border-primary transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {template.type === 'color' && (
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: value.metadata?.hex }}
                        />
                      )}
                      <span className="font-medium">{value.value}</span>
                      {value.metadata?.dimensions && (
                        <Badge variant="secondary">{value.metadata.dimensions}</Badge>
                      )}
                      {value.metadata?.surcharge && (
                        <Badge variant="secondary">+${value.metadata.surcharge}</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeValue(value.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for this variant template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Display Type</Label>
                  <Select
                    value={template.metadata?.displayType}
                    onValueChange={(value: 'dropdown' | 'color' | 'button' | 'radio') =>
                      setTemplate({
                        ...template,
                        metadata: { ...template.metadata, displayType: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select display type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="color">Color Picker</SelectItem>
                      <SelectItem value="button">Button Group</SelectItem>
                      <SelectItem value="radio">Radio Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={template.metadata?.required}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, required: e.target.checked }
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span>Required</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={template.metadata?.allowMultiple}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, allowMultiple: e.target.checked }
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span>Allow Multiple</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>Default Value</Label>
                  <Select
                    value={template.metadata?.defaultValue}
                    onValueChange={(value) =>
                      setTemplate({
                        ...template,
                        metadata: { ...template.metadata, defaultValue: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {template.values.map((value) => (
                        <SelectItem key={value.id} value={value.id}>
                          {value.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={template.metadata?.sortOrder || 0}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        metadata: { ...template.metadata, sortOrder: parseInt(e.target.value) }
                      })
                    }
                    placeholder="Enter sort order"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {previewMode && template.values.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how the variant will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPreview()}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!template.name || template.values.length === 0}>
          <Save className="mr-2 h-4 w-4" /> Save Template
        </Button>
      </div>
    </div>
  );
};

export default VariantTemplateForm;