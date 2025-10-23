import { Error404 } from '@shared/components/Error404';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ClientLayout } from '../layout/ClientLayout';
import { ContactPage, HomePage, LoginPage, OrderUserPage, ProductPage, RegisterPage, ShopPage } from './lazy';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='tienda' element={<ShopPage />} />
        <Route path='tienda/:slug' element={<ProductPage />} />
        <Route path='contacto' element={<ContactPage />} />
        <Route path='acceder' element={<LoginPage />} />
        <Route path='registrarse' element={<RegisterPage />} />
        <Route path='*' element={<Error404 />} />
      </Route>
      <Route path='/cuenta' element={<ClientLayout />} >
        <Route path='pedidos' element={<OrderUserPage />} />
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
