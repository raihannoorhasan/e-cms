"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  values: VariantValue[];
  metadata?: {
    displayType?: "dropdown" | "color" | "button" | "radio";
    required?: boolean;
    allowMultiple?: boolean;
    defaultValue?: string;
    description?: string;
    sortOrder?: number;
  };
}

interface Props {
  onSave: (template: VariantTemplate) => void;
  onCancel: () => void;
  existingTemplate?: VariantTemplate;
  isQuickAdd?: boolean;
}

const DISPLAY_EXAMPLES = {
  size: {
    name: "T-Shirt Size",
    display: "button",
    required: true,
    allowMultiple: false,
    description: "Choose your t-shirt size",
    values: ["S", "M", "L", "XL"],
  },
  color: {
    name: "Color Options",
    display: "color",
    required: true,
    allowMultiple: false,
    description: "Select a color",
    values: ["Black", "White", "Navy", "Red"],
  },
  material: {
    name: "Fabric Type",
    display: "radio",
    required: false,
    allowMultiple: false,
    description: "Choose your preferred fabric",
    values: ["Cotton", "Polyester", "Blend"],
  },
  toppings: {
    name: "Pizza Toppings",
    display: "dropdown",
    required: false,
    allowMultiple: true,
    description: "Select your toppings",
    values: ["Cheese", "Pepperoni", "Mushrooms", "Olives"],
  },
};

const DISPLAY_TYPES = [
  {
    value: "button",
    label: "Button Group",
    description: "Best for small sets of options like sizes or simple choices",
    example: "Size options: S, M, L, XL",
  },
  {
    value: "color",
    label: "Color Swatch",
    description: "Perfect for color selections with visual preview",
    example: "Product colors with visual swatches",
  },
  {
    value: "dropdown",
    label: "Dropdown Menu",
    description: "Ideal for long lists of options",
    example: "Country selection, product categories",
  },
  {
    value: "radio",
    label: "Radio List",
    description: "Good for options that need descriptions",
    example: "Shipping methods with prices and delivery times",
  },
];

const VariantTemplateForm = ({
  onSave,
  onCancel,
  existingTemplate,
  isQuickAdd,
}: Props) => {
  const [template, setTemplate] = useState<VariantTemplate>(
    existingTemplate || {
      id: crypto.randomUUID(),
      name: "",
      values: [],
      metadata: {
        displayType: "button",
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
      case "color":
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

      case "button":
        return (
          <div className="flex flex-wrap gap-2">
            {template.values.map((value) => (
              <Button key={value.id} variant="outline" className="h-9">
                {value.value}
                {value.metadata?.surcharge && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (+${value.metadata.surcharge})
                  </span>
                )}
              </Button>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {template.values.map((value) => (
              <label
                key={value.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input type="radio" name="preview" className="w-4 h-4" />
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
          <div className="w-full max-w-xs">
            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
              <option value="">Select {template.name}</option>
              {template.values.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.value}
                  {value.metadata?.surcharge
                    ? ` (+$${value.metadata.surcharge})`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {isQuickAdd && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Quick adding a variant template. This will be available immediately
            after creation.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
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
                Name and describe your variant option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Variant Name</Label>
                <Input
                  id="name"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="e.g., Size, Color, Material"
                />
              </div>

              <div className="space-y-4">
                <Label>Quick Setup Examples</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(DISPLAY_EXAMPLES).map(([key, example]) => (
                    <div
                      key={key}
                      className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      onClick={() => {
                        setTemplate({
                          ...template,
                          name: example.name,
                          metadata: {
                            displayType: example.display as any,
                            required: example.required,
                            allowMultiple: example.allowMultiple,
                            description: example.description,
                          },
                          values: example.values.map(value => ({
                            id: crypto.randomUUID(),
                            value,
                            metadata: {},
                          })),
                        });
                      }}
                    >
                      <h3 className="font-medium">{example.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {example.values.map(value => (
                          <Badge key={value} variant="secondary">
                            {value}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-sm">
                        <Badge variant={example.required ? "default" : "secondary"}>
                          {example.required ? "Required" : "Optional"}
                        </Badge>
                        {example.allowMultiple && (
                          <Badge variant="secondary" className="ml-2">
                            Multiple
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={template.metadata?.required}
                        onChange={(e) =>
                          setTemplate({
                            ...template,
                            metadata: {
                              ...template.metadata,
                              required: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span>Required Selection</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Force customers to choose an option before adding to cart
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={template.metadata?.allowMultiple}
                        onChange={(e) =>
                          setTemplate({
                            ...template,
                            metadata: {
                              ...template.metadata,
                              allowMultiple: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span>Allow Multiple Selections</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Let customers choose more than one option
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle>Variant Values</CardTitle>
              <CardDescription>
                Add the available options for this variant
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

                {template.metadata?.displayType === "color" && (
                  <div className="w-24">
                    <Input
                      type="color"
                      value={newMetadata.hex || "#000000"}
                      onChange={(e) =>
                        setNewMetadata({ ...newMetadata, hex: e.target.value })
                      }
                      className="h-9 p-1"
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
                      {template.metadata?.displayType === "color" && (
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: value.metadata?.hex }}
                        />
                      )}
                      <span className="font-medium">{value.value}</span>
                      {value.metadata?.surcharge && (
                        <Badge variant="secondary">
                          +${value.metadata.surcharge}
                        </Badge>
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

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Choose how this variant will appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {DISPLAY_TYPES.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      template.metadata?.displayType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-primary/20"
                    }`}
                    onClick={() =>
                      setTemplate({
                        ...template,
                        metadata: {
                          ...template.metadata,
                          displayType: type.value as any,
                        },
                      })
                    }
                  >
                    <h3 className="font-medium">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Example: {type.example}
                    </p>
                  </div>
                ))}
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
          <CardContent>{renderPreview()}</CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!template.name || template.values.length === 0}
        >
          <Save className="mr-2 h-4 w-4" /> Save Template
        </Button>
      </div>
    </div>
  );
};

export default VariantTemplateForm;