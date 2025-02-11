/*
  # CMS Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `variant_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `display_type` (text)
      - `required` (boolean)
      - `allow_multiple` (boolean)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `variant_values`
      - `id` (uuid, primary key)
      - `template_id` (uuid, foreign key)
      - `value` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category_id` (uuid, foreign key)
      - `base_price` (numeric)
      - `sku` (text)
      - `images` (text[])
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_variants`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `template_id` (uuid, foreign key)
      - `value_id` (uuid, foreign key)
      - `price_adjustment` (numeric)
      - `stock` (integer)
      - `sku` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Functions
    - Update stock function
    - Calculate total stock function
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Variant Templates Table
CREATE TABLE variant_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  display_type text NOT NULL,
  required boolean DEFAULT true,
  allow_multiple boolean DEFAULT false,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Variant Values Table
CREATE TABLE variant_values (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id uuid REFERENCES variant_templates(id) ON DELETE CASCADE,
  value text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  base_price numeric NOT NULL,
  sku text UNIQUE,
  images text[],
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Variants Table
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  template_id uuid REFERENCES variant_templates(id),
  value_id uuid REFERENCES variant_values(id),
  price_adjustment numeric DEFAULT 0,
  stock integer DEFAULT 0,
  sku text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, template_id, value_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read access"
ON categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access"
ON variant_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access"
ON variant_values FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access"
ON product_variants FOR SELECT
TO authenticated
USING (true);

-- Functions
CREATE OR REPLACE FUNCTION calculate_total_stock(product_id uuid)
RETURNS integer AS $$
DECLARE
  total integer;
BEGIN
  SELECT COALESCE(MIN(stock), 0)
  INTO total
  FROM product_variants
  WHERE product_id = $1;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_variant_templates_updated_at
  BEFORE UPDATE ON variant_templates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_variant_values_updated_at
  BEFORE UPDATE ON variant_values
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();