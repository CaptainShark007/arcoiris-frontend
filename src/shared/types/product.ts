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
	storage: string;
	color: string;
	color_name: string;
  finish: string | null;
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
  storage?: string;
  color_name?: string;
  finish?: string | null;
}

export interface Category {
  id: number;
  name: string;
  image: string;
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
}

export interface VariantInput {
	id?: string;
	stock: number;
	price: number;
	color: string;
	storage: string;
	color_name: string;
	finish?: string | null;
}