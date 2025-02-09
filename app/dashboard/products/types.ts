// Product Types
export type VariantType = 'size' | 'color' | 'volume' | 'material' | 'custom';

export type VariantValue = {
  id: string;
  value: string;
  price_adjustment: number;
  stock: number;
  sku: string;
};

export type ProductVariant = {
  type: VariantType;
  name: string;
  values: VariantValue[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category_id: string;
  vendor_id: string;
  images: string[];
  variants: ProductVariant[];
  has_variants: boolean;
  stock: number;
  sku: string;
  status: 'active' | 'draft' | 'out_of_stock';
  created_at: string;
  updated_at: string;
};

// Stock Types
export type StockMovement = {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  type: 'in' | 'out';
  reason: 'purchase' | 'sale' | 'return' | 'adjustment';
  date: string;
  notes?: string;
};