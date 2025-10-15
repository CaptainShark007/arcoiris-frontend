import { Error404 } from '@shared/components/Error404';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { ContactPage, HomePage } from './lazy';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='contacto' element={<ContactPage />} />
        <Route path='*' element={<Error404 />} />
      </Route>
    </Routes>
  );
}
