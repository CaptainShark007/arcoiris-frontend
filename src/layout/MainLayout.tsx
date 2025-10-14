import { Outlet } from 'react-router';
import { Footer, Navbar, WhatsappButton } from '@shared/components';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsappButton />
      <Footer />
    </>
  );
}
