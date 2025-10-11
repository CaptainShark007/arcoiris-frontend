import { Outlet } from 'react-router';
import { Navbar } from '@shared/components/Nav';
import { WhatsappButton } from '@shared/components/WhatsappButton';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsappButton />
    </>
  );
}
