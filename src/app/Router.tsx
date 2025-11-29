import { Error404 } from '@shared/components/Error404';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ClientLayout } from '../layout/ClientLayout';
import {
  ContactPage,
  HomePage,
  LoginPage,
  ProductPage,
  RegisterPage,
  ShopPage,
  CartPage,
  CheckoutPage,
  OrdersUserPage,
  OrderUserPage,
  DashboardProductsPage,
  DashboardOrdersPage,
  DashboardNewProductPage,
  DashboardProductSlugPage,
  DashboardOrderPage,
  DashboardPartnersPage,
  DashboardBannerPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  FormEditUserPage,
} from './lazy';
import { DashboardLayout } from '@layout/DashboardLayout';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        {/* Páginas públicas */}
        <Route index element={<HomePage />} />
        <Route path='tienda' element={<ShopPage />} />
        <Route path='tienda/:slug' element={<ProductPage />} />
        <Route path='contacto' element={<ContactPage />} />
        <Route path='acceder' element={<LoginPage />} />
        <Route path='registrarse' element={<RegisterPage />} />
        <Route path='carrito' element={<CartPage />} />
        <Route path='recuperar-contrasena' element={<ForgotPasswordPage />} />
        <Route path='restablecer-contrasena' element={<ResetPasswordPage />} />

        {/* Rutas protegidas del cliente */}
        <Route path='cuenta' element={<ClientLayout />}>
          <Route index element={<Navigate to='pedidos' replace />} />
          <Route path='pedidos' element={<OrdersUserPage />} />
          <Route path='pedidos/:id' element={<OrderUserPage />} />
          <Route path='editar' element={<FormEditUserPage />} />
        </Route>

        {/* Página de checkout */}
        <Route path='verificar' element={<CheckoutPage />} />

        {/* Página 404 */}
        <Route path='*' element={<Error404 />} />
      </Route>

      {/* Paginas del administrador */}
      <Route path='panel' element={<DashboardLayout />}>
        <Route index element={<Navigate to='productos' replace />} />
        <Route path='productos' element={<DashboardProductsPage />} />
        <Route path='productos/nuevo' element={<DashboardNewProductPage />} />
        <Route
          path='productos/editar/:slug'
          element={<DashboardProductSlugPage />}
        />
        <Route path='pedidos' element={<DashboardOrdersPage />} />
        <Route path='pedidos/:id' element={<DashboardOrderPage />} />
        <Route path='socios' element={<DashboardPartnersPage />} />
        <Route path='banners' element={<DashboardBannerPage />} />
      </Route>
    </Routes>
  );
}
