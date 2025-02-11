"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle } from "lucide-react";
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

export type VariantType = 'size' | 'color' | 'volume' | 'material' | 'custom';

export interface VariantValue {
  id: string;
  value: string;
  metadata?: {
    hex?: string;  // For colors
    dimensions?: string;  // For sizes
    weight?: string;  // For materials
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
  };
}

interface Props {
  onSave: (template: VariantTemplate) => void;
  onCancel: () => void;
  existingTemplate?: VariantTemplate;
  isQuickAdd?: boolean;
}

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
      },
    }
  );

  const [newValue, setNewValue] = useState("");
  const [newMetadata, setNewMetadata] = useState<{
    hex?: string;
    dimensions?: string;
    weight?: string;
  }>({});

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

  const getMetadataInput = () => {
    switch (template.type) {
      case 'color':
        return (
          <div className="flex-1">
            <Input
              type="color"
              value={newMetadata.hex || "#000000"}
              onChange={(e) => setNewMetadata({ ...newMetadata, hex: e.target.value })}
              className="h-9 p-1"
            />
          </div>
        );
      case 'size':
        return (
          <div className="flex-1">
            <Input
              placeholder="Dimensions (e.g., 30x40cm)"
              value={newMetadata.dimensions || ""}
              onChange={(e) => setNewMetadata({ ...newMetadata, dimensions: e.target.value })}
            />
          </div>
        );
      case 'material':
        return (
          <div className="flex-1">
            <Input
              placeholder="Weight/Density"
              value={newMetadata.weight || ""}
              onChange={(e) => setNewMetadata({ ...newMetadata, weight: e.target.value })}
            />
          </div>
        );
      default:
        return null;
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
        <Label>Display Settings</Label>
        <div className="grid grid-cols-2 gap-4">
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
          {getMetadataInput()}
          <Button onClick={addValue}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {template.values.map((value) => (
            <Badge 
              key={value.id} 
              variant="secondary" 
              className="px-2 py-1"
              style={value.metadata?.hex ? { backgroundColor: value.metadata.hex } : undefined}
            >
              {value.value}
              {value.metadata?.dimensions && ` (${value.metadata.dimensions})`}
              {value.metadata?.weight && ` (${value.metadata.weight})`}
              <button
                onClick={() => removeValue(value.id)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
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
};

export default VariantTemplateForm;