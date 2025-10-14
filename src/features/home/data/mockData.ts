import type { CarouselSlide, Category, Product } from '../types/home.types';
//import banner1 from '../../../assets/images/banner/banner1.jpg';
//import banner2 from '../../../assets/images/banner/banner2.jpg';
//import banner3 from '../../../assets/images/banner/b1.png';

import bannerDesktop from '../../../assets/images/banner/bpd.png';
import bannerMovil from '../../../assets/images/banner/bpc.png';

import product1 from '../../../assets/images/img-default.png';
import img1 from '../../../assets/images/products/img4.jpg';
import img2 from '../../../assets/images/products/img5.png';
import cat1 from '../../../assets/images/categories/cat1.png';

export const carouselSlides: CarouselSlide[] = [
    {
    id: "1",
    image: bannerDesktop,
    mobileImage: bannerMovil,
    title: "Otoño 2024", // Solo para el alt text
    subtitle: "", // Vacío
    buttonText: "", // Vacío
    mobilePosition: "center center",
    desktopPosition: "center center"
  },
  {
    id: "2",
    image: bannerDesktop, 
    mobileImage: bannerMovil,
    title: "Ofertas Especiales",
    subtitle: "",
    buttonText: "",
    mobilePosition: "center center",
    desktopPosition: "center center"
  },
  {
    id: "3",
    image: bannerDesktop,
    mobileImage: bannerMovil,
    title: "Envío Gratis",
    subtitle: "",
    buttonText: "",
    mobilePosition: "center center",
    desktopPosition: "center center"
  }
];

export const categories: Category[] = [
  { id: 1, name: "Pinturas", image: cat1 },
  { id: 2, name: "Internacionales", image: product1 },
  { id: 3, name: "Cafeteras", image: product1 },
  { id: 4, name: "Cocinas", image: product1 },
  { id: 5, name: "Aspiradoras", image: product1 },
  { id: 6, name: "Celulares", image: product1 },
  { id: 7, name: "Ventiladores", image: product1 },
  { id: 8, name: "Ofertas", image: product1 }, // solo funciona bien cuando tiene 8 como minimo el carrusel de categorias
  { id: 9, name: "Importados", image: product1 },
  { id: 10, name: "Café", image: product1 },
  { id: 11, name: "Electrodomésticos", image: product1 },
  { id: 12, name: "Limpieza", image: product1 },
  { id: 13, name: "Tecnología", image: product1 },
  { id: 14, name: "Enfriadores", image: product1 },
];

export const allProducts: Product[] = [
  { id: 1, name: 'Latex Exterior Loxon Mate Blanco 1 Lt Sherwin Williams', price: 16325.00, image: img1, discount: 10, isNew: true },
  { id: 2, name: 'Canilla 1/2 PVC Esferica Manija Larga DUKE', price: 3500.50, image: img2, discount: 10, isNew: true },
  { id: 3, name: 'Tablet Elite', price: 459.99, image: product1, discount: 0, isNew: true },
  { id: 4, name: 'Smart TV 4K', price: 899.99, image: product1, discount: 5, isNew: true },
  { id: 5, name: 'Drone Pro', price: 1299.99, image: product1, discount: 0, isNew: true },
  { id: 6, name: 'Cámara Mirrorless', price: 749.99, image: product1, discount: 8, isNew: true },
  { id: 7, name: 'Smart Home Hub', price: 159.99, image: product1, discount: 0, isNew: true },
  { id: 8, name: 'Monitor Curvo', price: 349.99, image: product1, discount: 12, isNew: true },
  { id: 9, name: 'E-reader Premium', price: 189.99, image: product1, discount: 0, isNew: true },
  { id: 10, name: 'Router WiFi 6', price: 229.99, image: product1, discount: 7, isNew: true },
  { id: 11, name: 'Tablet Drawing', price: 599.99, image: product1, discount: 0, isNew: true },
  { id: 12, name: 'Smart Glasses', price: 399.99, image: product1, discount: 15, isNew: true },
  { id: 13, name: 'Portátil Ultraligero', price: 1199.99, image: product1, discount: 0, isNew: true },
  { id: 14, name: 'Auriculares Deportivos', price: 129.99, image: product1, discount: 10, isNew: true },
  { id: 15, name: 'Smart Band Pro', price: 89.99, image: product1, discount: 0, isNew: true }
];