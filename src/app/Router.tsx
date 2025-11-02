import { Error404 } from '@shared/components/Error404';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ClientLayout } from '../layout/ClientLayout';
import { ContactPage, HomePage, LoginPage, OrderUserPage, ProductPage, RegisterPage, ShopPage, CartPage } from './lazy';

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

        {/* Página 404 */}
        <Route path='*' element={<Error404 />} />
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
