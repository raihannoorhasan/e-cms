"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductVariant, VariantType } from "../types";

export default function ProductVariantsForm({
  variants,
  onChange,
}: {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}) {
  const [selectedType, setSelectedType] = useState<VariantType>("size");

  const addVariant = () => {
    const newVariant: ProductVariant = {
      type: selectedType,
      name: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
      values: [],
    };
    onChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
  };

  const addVariantValue = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].values.push({
      id: Math.random().toString(36).substr(2, 9),
      value: "",
      price_adjustment: 0,
      stock: 0,
      sku: "",
    });
    onChange(newVariants);
  };

  const updateVariantValue = (
    variantIndex: number,
    valueIndex: number,
    field: string,
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[variantIndex].values[valueIndex][field] = value;
    onChange(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedType}
          onValueChange={(value: VariantType) => setSelectedType(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select variant type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addVariant}>
          <Plus className="mr-2 h-4 w-4" /> Add Variant
        </Button>
      </div>

      {variants.map((variant, variantIndex) => (
        <div
          key={variantIndex}
          className="border rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={variant.name}
                onChange={(e) => {
                  const newVariants = [...variants];
                  newVariants[variantIndex].name = e.target.value;
                  onChange(newVariants);
                }}
                placeholder="Variant name"
                className="w-[200px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => addVariantValue(variantIndex)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Value
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeVariant(variantIndex)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {variant.values.map((value, valueIndex) => (
              <div key={value.id} className="space-y-2">
                <Input
                  value={value.value}
                  onChange={(e) =>
                    updateVariantValue(
                      variantIndex,
                      valueIndex,
                      "value",
                      e.target.value
                    )
                  }
                  placeholder={`${variant.name} value`}
                />
                <Input
                  type="number"
                  value={value.price_adjustment}
                  onChange={(e) =>
                    updateVariantValue(
                      variantIndex,
                      valueIndex,
                      "price_adjustment",
                      parseFloat(e.target.value)
                    )
                  }
                  placeholder="Price adjustment"
                />
                <Input
                  type="number"
                  value={value.stock}
                  onChange={(e) =>
                    updateVariantValue(
                      variantIndex,
                      valueIndex,
                      "stock",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="Stock"
                />
                <Input
                  value={value.sku}
                  onChange={(e) =>
                    updateVariantValue(
                      variantIndex,
                      valueIndex,
                      "sku",
                      e.target.value
                    )
                  }
                  placeholder="SKU"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}