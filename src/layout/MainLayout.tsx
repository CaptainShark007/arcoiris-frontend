import { Outlet } from 'react-router';
import { Footer, Navbar, WhatsappButton } from '@shared/components';
import { Toaster } from 'react-hot-toast';

export default function MainLayout() {
  return (
    <>
      <Toaster position='top-right' />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsappButton />
      <Footer />
    </>
  );
}
