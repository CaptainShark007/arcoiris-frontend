//import bannerDesktop from '../../../assets/images/banner/bpd.png';
//import bannerMovil from '../../../assets/images/banner/bpc.png';
import bannerDesktop1 from '../../../assets/images/banner/banner-interior-min.png';
import bannerDesktop2 from '../../../assets/images/banner/bannerDesktop2.jpg';
import bannerDesktop3 from '../../../assets/images/banner/bannerDesktop3.jpg';

import bannerMobile1 from '../../../assets/images/banner/BannerMobile1.jpg';
import bannerMobile2 from '../../../assets/images/banner/BannerMobile2.jpg';
import bannerMobile3 from '../../../assets/images/banner/BannerMobile3.webp';

import { CarouselSlide } from '@shared/types';

export const carouselSlides: CarouselSlide[] = [
    {
    id: "1",
    image: bannerDesktop3,
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
    image: bannerDesktop1,
    mobileImage: bannerMobile3,
    title: "Envío Gratis",
    subtitle: "",
    buttonText: "",
    mobilePosition: "center center",
    desktopPosition: "center center"
  }
];
