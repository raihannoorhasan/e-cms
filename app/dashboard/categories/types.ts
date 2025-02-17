import { VariantTemplate } from "../variants/components/VariantTemplateForm";

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  variants: VariantTemplate[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}