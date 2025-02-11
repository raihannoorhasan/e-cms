"use client";

import { useMemo } from 'react';
import { useCMS } from '@/lib/store/cms-context';
import type { Category, ProductVariant } from '@/app/dashboard/products/types';

export function useVariants(categoryId: string | null) {
  const { state } = useCMS();

  const category = useMemo(() => 
    categoryId ? state.categories.find(c => c.id === categoryId) : null,
    [state.categories, categoryId]
  );

  const calculateTotalStock = (variants: ProductVariant[]) => {
    if (!variants.length) return 0;
    
    // Group variants by template
    const variantsByTemplate = variants.reduce((acc, variant) => {
      if (!acc[variant.variantTemplateId]) {
        acc[variant.variantTemplateId] = [];
      }
      acc[variant.variantTemplateId].push(variant);
      return acc;
    }, {} as Record<string, ProductVariant[]>);

    // Find minimum stock across all variant combinations
    let minStock = Infinity;
    Object.values(variantsByTemplate).forEach(templateVariants => {
      const totalTemplateStock = templateVariants.reduce(
        (sum, variant) => sum + variant.selectedValues.reduce(
          (valueSum, value) => valueSum + value.stock, 
          0
        ),
        0
      );
      minStock = Math.min(minStock, totalTemplateStock);
    });

    return minStock === Infinity ? 0 : minStock;
  };

  const generateSkuForVariant = (
    baseSku: string,
    variant: ProductVariant,
    category: Category
  ) => {
    const template = category.variants.find(t => t.id === variant.variantTemplateId);
    if (!template) return baseSku;

    const valueIds = variant.selectedValues.map(v => v.valueId).sort().join('-');
    return `${baseSku}-${template.type.substring(0, 3).toUpperCase()}-${valueIds}`;
  };

  return {
    category,
    calculateTotalStock,
    generateSkuForVariant,
  };
}