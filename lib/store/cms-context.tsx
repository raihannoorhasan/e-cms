"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Category, Product, VariantTemplate, ProductVariant } from '@/app/dashboard/products/types';

type State = {
  categories: Category[];
  products: Product[];
  variantTemplates: VariantTemplate[];
};

type Action = 
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_VARIANT_TEMPLATE'; payload: { categoryId: string; template: VariantTemplate } }
  | { type: 'UPDATE_VARIANT_TEMPLATE'; payload: VariantTemplate }
  | { type: 'DELETE_VARIANT_TEMPLATE'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_PRODUCT_VARIANTS'; payload: { productId: string; variants: ProductVariant[] } };

const initialState: State = {
  categories: [],
  products: [],
  variantTemplates: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat => 
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    
    case 'ADD_VARIANT_TEMPLATE':
      return {
        ...state,
        categories: state.categories.map(cat => 
          cat.id === action.payload.categoryId
            ? { ...cat, variants: [...cat.variants, action.payload.template] }
            : cat
        ),
      };
    
    case 'UPDATE_VARIANT_TEMPLATE':
      return {
        ...state,
        categories: state.categories.map(cat => ({
          ...cat,
          variants: cat.variants.map(v => 
            v.id === action.payload.id ? action.payload : v
          ),
        })),
      };
    
    case 'DELETE_VARIANT_TEMPLATE':
      return {
        ...state,
        categories: state.categories.map(cat => ({
          ...cat,
          variants: cat.variants.filter(v => v.id !== action.payload),
        })),
      };
    
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(prod => 
          prod.id === action.payload.id ? action.payload : prod
        ),
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(prod => prod.id !== action.payload),
      };
    
    case 'UPDATE_PRODUCT_VARIANTS':
      return {
        ...state,
        products: state.products.map(prod => 
          prod.id === action.payload.productId
            ? { ...prod, variants: action.payload.variants }
            : prod
        ),
      };
    
    default:
      return state;
  }
}

const CMSContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CMSContext.Provider value={{ state, dispatch }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}