export interface ProductVariant {
  id?: string;
  stock: number;
  price: number;
  storage: string;
  color: string;
  colorName: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  features?: string[];
  description: string;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  brand: string;
  slug: string;
  features?: string[];
  description: string;
  images: (File | string)[];
  variants: ProductVariant[];
}
