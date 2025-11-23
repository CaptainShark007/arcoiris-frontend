import { lazy } from 'react';

export const HomePage = lazy(() => import('../features/home/pages/HomePage'));
export const ContactPage = lazy(() => import('../features/contact/pages/ContactPage'));
export const ShopPage = lazy(() => import('../features/shop/pages/ShopPage'));
export const ProductPage = lazy(() => import('../features/product/pages/ProductPage'));
export const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
export const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
export const OrdersUserPage = lazy(() => import('../features/orders/pages/OrdersUserPage'));
export const OrderUserPage = lazy(() => import('../features/orders/pages/OrderUserPage'));
export const CartPage = lazy(() => import('../features/cart/pages/CartPage'));
export const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));
export const DashboardProductsPage = lazy(() => import('../features/admin/pages/DashboardProductsPage'));
export const DashboardNewProductPage = lazy(() => import('../features/admin/pages/DashboardNewProductPage'));
export const DashboardProductSlugPage = lazy(() => import('../features/admin/pages/DashboardProductSlugPage'));
export const DashboardOrdersPage = lazy(() => import('../features/admin/pages/DashboardOrdersPage'));
export const DashboardOrderPage = lazy(() => import('../features/admin/pages/DashboardOrderPage'));