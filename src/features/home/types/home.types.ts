/* export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount: number;
  isNew: boolean;
  originalPrice?: number;
} */

// Adapta el tipo Product para que coincida con tu BD
export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  description: any;
  features: string[];
  images: string[];
  created_at: string;
  image: string; // imagen calculada
  price: number; // precio calculado
  variants?: Array<{
    id: string;
    color: string;
    color_name: string;
    price: number;
    product_id: string;
    stock: number;
    storage: string;
  }>;
  // Campos opcionales para badges (puedes calcularlos después)
  isNew?: boolean;
  discount?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

/* export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
} */

// En tu archivo home.types.ts
export interface CarouselSlide {
  id: string;
  image: string;
  mobileImage?: string;
  title: string; // Solo para accesibilidad (alt text)
  subtitle: string; // Puede estar vacío
  buttonText: string; // Puede estar vacío
  mobilePosition?: string;
  desktopPosition?: string;
}

export interface ProductSectionProps {
  title: string;
  products: Product[];
  type: 'new-arrivals' | 'best-sellers' | 'offers';
  showOriginalPrice?: boolean;
}