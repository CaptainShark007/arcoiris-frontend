// Tipos compartidos para componentes reusables

export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  isNew?: boolean;
  category?: string;
  description?: string;
  stock?: number;
}

export interface CarouselSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonAction?: () => void;
  link?: string;
}

export interface Category {
  id: string | number;
  name: string;
  image: string;
  link?: string;
  productCount?: number;
}

export interface MenuItem {
  id: string | number;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Tipos del carrito
export * from './cart';
