import type { VariantTemplate } from "../variants/components/VariantTemplateForm";

export interface Category {
  id: string;
  name: string;
  variants: VariantTemplate[];
}

export interface ProductVariant {
  variantTemplateId: string;
  selectedValues: {
    valueId: string;
    price_adjustment: number;
    stock: number;
    sku: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  sku: string;
  images: string[];
  variants: ProductVariant[];
  stock: number;
  status: 'draft' | 'active' | 'inactive';
}

export interface Vendor {
  id: string;
  name: string;
}