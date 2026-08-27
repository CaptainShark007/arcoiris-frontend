import { lazy } from 'react';

export const HomePage = lazy(() => import('../features/home/pages/HomePage'));
export const ContactPage = lazy(() => import('../features/contact/pages/ContactPage'));
export const ShopPage = lazy(() => import('../features/shop/pages/ShopPage'));
export const ProductPage = lazy(() => import('../features/product/pages/ProductPage'));
export const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
export const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
export const OrdersUserPage = lazy(() => import('../features/orders/pages/OrdersUserPage'));
export const OrderUserPage = lazy(() => import('../features/orders/pages/OrderUserPage'));
export const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));
export const PaymentResultPage = lazy(() => import('../features/checkout/pages/PaymentResultPage'));

export const DashboardOverviewPage = lazy(() => import('../features/admin/pages/DashboardOverviewPage'));
export const DashboardCategoriesPage = lazy(() => import('../features/admin/pages/DashboardCategoriesPage'));
export const DashboardInventoriesPage = lazy(() => import('../features/admin/pages/DashboardInventoriesPage'));
export const DashboardNewProductPage = lazy(() => import('../features/admin/pages/DashboardNewProductPage'));
export const DashboardOrderPage = lazy(() => import('../features/admin/pages/DashboardOrderPage'));
export const DashboardOrdersPage = lazy(() => import('../features/admin/pages/DashboardOrdersPage'));
export const DashboardPartnersPage = lazy(() => import('../features/admin/pages/DashboardPartnersPage'));
export const DashboardPosPage = lazy(() => import('../features/admin/pages/DashboardPosPage'));
export const DashboardProductSlugPage = lazy(() => import('../features/admin/pages/DashboardProductSlugPage'));
export const DashboardProductsPage = lazy(() => import('../features/admin/pages/DashboardProductsPage'));
export const DashboardAdminClientsPage = lazy(() => import('../features/admin/pages/DashboardAdminClientsPage'));
export const DashboardBudgetsPage = lazy(() => import('../features/admin/pages/DashboardBudgetsPage'));
export const DashboardBudgetPage = lazy(() => import('../features/admin/pages/DashboardBudgetPage'));

export const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
export const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));
export const FormEditUserPage = lazy(() => import('../features/orders/pages/FormEditCustomerPage'));