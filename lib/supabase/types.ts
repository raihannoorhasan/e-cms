export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      variant_templates: {
        Row: {
          id: string
          name: string
          type: string
          display_type: string
          required: boolean
          allow_multiple: boolean
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          display_type: string
          required?: boolean
          allow_multiple?: boolean
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          display_type?: string
          required?: boolean
          allow_multiple?: boolean
          category_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      variant_values: {
        Row: {
          id: string
          template_id: string
          value: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_id: string
          value: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          value?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string
          base_price: number
          sku: string | null
          images: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id: string
          base_price: number
          sku?: string | null
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string
          base_price?: number
          sku?: string | null
          images?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          template_id: string
          value_id: string
          price_adjustment: number
          stock: number
          sku: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          template_id: string
          value_id: string
          price_adjustment?: number
          stock?: number
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          template_id?: string
          value_id?: string
          price_adjustment?: number
          stock?: number
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_total_stock: {
        Args: {
          product_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}