import { JSONContent } from '@tiptap/react';
import { Json } from '../../supabase/supabase'

export interface Color {
	name: string;
	color: string;
	price: number;
}

export interface VariantProduct {
	id: string;
	stock: number;
	price: number;
	original_price: number | null;
	storage: string | null;
	color: string | null;
	color_name: string | null;
  finish: string | null;
  is_active: boolean;
}

export interface Product {
	id: string;
	name: string;
	brand: string;
	slug: string;
	features: string[];
	description: Json;
	images: string[];
	created_at: string;
	variants: VariantProduct[];
	price?: number;
  maxPrice?: number;
  hasMultiplePrices?: boolean;
  image?: string;
}

export interface PreparedProducts {
	id: string;
	name: string;
	brand: string;
	slug: string;
	features: string[];
	description: Json;
	images: string[];
	created_at: string;
	price: number;
	colors: {
		name: string;
		color: string;
	}[];
	variants: VariantProduct[];
}

/* export interface Variant {
  id: string;
  color: string;
  stock: number;
	price: number;
} */

export interface Variant {
  id: string;
  color: string;
  stock: number;
  price: number;
	original_price?: number | null;
  storage?: string;
  color_name?: string;
  finish?: string | null;
  is_active: boolean;
}

export interface CarouselSlide {
  id: string;
  image: string;
  mobileImage?: string;
  title: string; 
  subtitle: string;
  buttonText: string;
  mobilePosition?: string;
  desktopPosition?: string;
}

export interface ProductSectionProps {
  title: string;
  products: Product[];
  type: 'new-arrivals' | 'best-sellers' | 'offers';
  showOriginalPrice?: boolean;
}

// types para creacion y edición de productos en el admin
export interface ProductInput {
	name: string;
	brand: string;
	slug: string;
	features: string[];
	description: JSONContent;
	images: File[];
	variants: VariantInput[];
	is_active: boolean | null;
}

export interface VariantInput {
	id?: string;
	stock: number;
	price: number;
	color?: string;
	original_price?: number | null;
	storage?: string;
	color_name?: string;
	finish?: string | null;
}

export type CreateProductRPCResult = {
  product_id: string;
  success: boolean;
  message: string;
};

// type para el HeaderSearch
export interface ProductSearch {
  id: string;
  name: string;
  slug: string;
  images: string[];
  variants: Array<{ 
		price: number
		original_price: number | null
		color_name: string | null
		storage: string | null
		finish:  string | null
	}>;
}

export interface HeaderSearchProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}