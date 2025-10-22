import { lazy } from 'react';

export const HomePage = lazy(() => import('../features/home/pages/HomePage'));
export const ContactPage = lazy(() => import('../features/contact/pages/ContactPage'));
export const ShopPage = lazy(() => import('../features/shop/pages/ShopPage'));
export const ProductPage = lazy(() => import('../features/product/pages/ProductPage'));