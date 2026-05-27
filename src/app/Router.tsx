import { Error404 } from '@shared/components/Error404';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ClientLayout } from '../layout/ClientLayout';
import { DashboardLayout } from '@layout/DashboardLayout';
import { PosLayout } from '@layout/PosLayout';
import {
  ContactPage,
  HomePage,
  LoginPage,
  ProductPage,
  RegisterPage,
  ShopPage,
  CheckoutPage,
  PaymentResultPage,
  OrdersUserPage,
  OrderUserPage,
  DashboardProductsPage,
  DashboardOrdersPage,
  DashboardNewProductPage,
  DashboardProductSlugPage,
  DashboardOrderPage,
  DashboardPartnersPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  FormEditUserPage,
  DashboardPosPage,
  DashboardCategoriesPage,
  DashboardInventoriesPage,
  DashboardOverviewPage,
} from './lazy';

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

        {/* Resultado de pago con Mercado Pago */}
        <Route path='pago/resultado' element={<PaymentResultPage />} />

        {/* Página 404 */}
        <Route path='*' element={<Error404 />} />
      </Route>

      {/* Paginas del administrador */}
      <Route path='panel' element={<DashboardLayout />}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path='productos' element={<DashboardProductsPage />} />
        <Route path='productos/nuevo' element={<DashboardNewProductPage />} />
        <Route path='productos/editar/:slug' element={<DashboardProductSlugPage />} />
        <Route path='inventario' element={<DashboardInventoriesPage />} />
        <Route path='categorias' element={<DashboardCategoriesPage />} />
        <Route path='pedidos' element={<DashboardOrdersPage />} />
        <Route path='pedidos/:id' element={<DashboardOrderPage />} />
        <Route path='socios' element={<DashboardPartnersPage />} />
      </Route>

      {/* POS - layout sin sidebar */}
      <Route path='panel' element={<PosLayout />}>
        <Route path='punto-de-venta' element={<DashboardPosPage />} />
      </Route>
    </Routes>
  );
}
