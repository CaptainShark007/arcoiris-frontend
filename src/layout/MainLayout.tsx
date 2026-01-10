import { Outlet } from 'react-router';
import { Footer, Navbar, WhatsappButton } from '@shared/components';
import { Toaster } from 'react-hot-toast';
import { useReferral } from '@shared/hooks/useReferral';

export default function MainLayout() {

  useReferral();

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
