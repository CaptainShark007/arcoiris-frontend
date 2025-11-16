import { Error404 } from '@shared/components/Error404';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ClientLayout } from '../layout/ClientLayout';
import { ContactPage, HomePage, LoginPage, OrderUserPage, ProductPage, RegisterPage, ShopPage, CartPage, CheckoutPage } from './lazy';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardProductsPage } from '@/pages/dashboard/DashboardProductsPage';
import { DashboardNewProductPage } from '@/pages/dashboard/DashboardNewProductPage';
import { DashboardProductSlugPage } from '@/pages/dashboard/DashboardProductSlugPage';
import { DashboardOrdersPage } from '@/pages/dashboard/DashboardOrdersPage';
import { DashboardOrderPage } from '@/pages/dashboard/DashboardOrderPage';

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

        {/* Rutas protegidas del cliente */}
        <Route path='cuenta' element={<ClientLayout />}>
          <Route index element={<Navigate to='pedidos' replace />} />
          <Route path='pedidos' element={<OrderUserPage />} />
        </Route>

        {/* Página de checkout */}
        <Route path='verificar' element={<CheckoutPage />} />

        {/* Página 404 */}
        <Route path='*' element={<Error404 />} />
      </Route>

      {/* Rutas del dashboard */}
      <Route path='dashboard' element={<DashboardLayout />}>
        <Route index element={<Navigate to='productos' replace />} />
        <Route path='productos' element={<DashboardProductsPage />} />
        <Route path='productos/new' element={<DashboardNewProductPage />} />
        <Route path='productos/editar/:slug' element={<DashboardProductSlugPage />} />
        <Route path='ordenes' element={<DashboardOrdersPage />} />
        <Route path='ordenes/:id' element={<DashboardOrderPage />} />
      </Route>
    </Routes>
  );
}

/*
debo lograr similar a esto
patch: 'cuenta',
element: <ClientLayout />,
children: [
  {
    path: '',
    element: <Navigate to='/cuenta/pedidos' />
  },
  {
    path: 'pedidos',
    element: <OrderUserPage />
  }
]
*/
