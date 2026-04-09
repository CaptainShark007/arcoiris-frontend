/* import bannerDesktop1 from '../../../assets/images/banner/banner-interior-min.png';
import bannerDesktop2 from '../../../assets/images/banner/bannerDesktop2.jpg';
import bannerDesktop3 from '../../../assets/images/banner/bannerDesktop3.jpg';

import bannerMobile1 from '../../../assets/images/banner/BannerMobile1.jpg';
import bannerMobile2 from '../../../assets/images/banner/BannerMobile2.jpg';
import bannerMobile3 from '../../../assets/images/banner/BannerMobile3.webp'; */

/* const bannerDesktop1 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen1.jpeg';
const bannerDesktop2 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen2.jpeg';
const bannerDesktop3 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen3.jpeg';

const bannerMobile1 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen1.jpeg';
const bannerMobile2 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen2.jpeg';
const bannerMobile3 = 'http://127.0.0.1:54321/storage/v1/object/public/product-images/imagen3.jpeg'; */

const bannerDesktop1 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen2.jpeg';
const bannerDesktop2 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen1.jpeg';
const bannerDesktop3 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen3.jpeg';

const bannerMobile1 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen2.jpeg';
const bannerMobile2 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen1.jpeg';
const bannerMobile3 = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/banners/imagen3.jpeg';

import { CarouselSlide } from '@shared/types';

export const carouselSlides: CarouselSlide[] = [
    {
    id: "1",
    image: bannerDesktop1,
    mobileImage: bannerMobile1,
    title: "Otoño 2024", // Solo para el alt text
    subtitle: "", // Vacío
    buttonText: "", // Vacío
    mobilePosition: "center center",
    desktopPosition: "center center"
  },
  {
    id: "2",
    image: bannerDesktop2,
    mobileImage: bannerMobile2,
    title: "Ofertas Especiales",
    subtitle: "",
    buttonText: "",
    mobilePosition: "center center",
    desktopPosition: "center center"
  },
  {
    id: "3",
    image: bannerDesktop3,
    mobileImage: bannerMobile3,
    title: "Envío Gratis",
    subtitle: "",
    buttonText: "",
    mobilePosition: "center center",
    desktopPosition: "center center"
  }
];
