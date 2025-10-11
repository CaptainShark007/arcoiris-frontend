import type { CarouselSlide, Category, Product } from '../types/home.types';
import banner1 from '../../../assets/images/banner/banner1.jpg';
import banner2 from '../../../assets/images/banner/banner2.jpg';
import banner3 from '../../../assets/images/banner/banner_example1.png';
import product1 from '../../../assets/images/img-default.png';

export const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    image: banner1,
    title: "Otoño 2024",
    subtitle: "Nueva colección disponible",
    buttonText: "Descubrir"
  },
  {
    id: 2,
    image: banner2,
    title: "Hasta 50% OFF",
    subtitle: "En electrónicos seleccionados",
    buttonText: "Comprar Ahora"
  },
  {
    id: 3,
    image: banner3,
    title: "Envío Gratis",
    subtitle: "En compras mayores a $100",
    buttonText: "Ver Ofertas"
  }
];

export const categories: Category[] = [
  { id: 1, name: "Descuentos", image: product1 },
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
  { id: 1, name: 'Smartphone Pro', price: 799.99, image: product1, discount: 0, isNew: true },
  { id: 2, name: 'Auriculares Inalámbricos', price: 199.99, image: product1, discount: 10, isNew: true },
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