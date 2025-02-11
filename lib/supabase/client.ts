import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Real-time subscriptions
export const subscribeToCategories = (callback: (payload: any) => void) => {
  return supabase
    .channel('categories')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, callback)
    .subscribe();
};

export const subscribeToProducts = (callback: (payload: any) => void) => {
  return supabase
    .channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .subscribe();
};

export const subscribeToVariants = (callback: (payload: any) => void) => {
  return supabase
    .channel('variants')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, callback)
    .subscribe();
};