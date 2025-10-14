export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount: number;
  isNew: boolean;
  originalPrice?: number;
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