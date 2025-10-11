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

export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface ProductSectionProps {
  title: string;
  products: Product[];
  type: 'new-arrivals' | 'best-sellers' | 'offers';
  showOriginalPrice?: boolean;
}