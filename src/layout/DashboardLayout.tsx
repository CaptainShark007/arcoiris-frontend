import { Sidebar } from '@features/admin';
import { Outlet, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useUsers } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { getSession, getUserRole } from '@/actions';
import { Loader, SeoHead } from '@shared/components';
import { useAuthStateChange } from '@features/auth/hooks';
import { useSidebar } from '@/shared/contexts/SidebarContext';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isLoading, session } = useUsers();
  const { isOpen } = useSidebar();
  const [roleLoading, setRoleLoading] = useState(true);

  useAuthStateChange();

  useEffect(() => {
    const checkRole = async () => {
      setRoleLoading(true);
      const session = await getSession();

      if (!session) {
        navigate('/acceder');
      }

      const role = await getUserRole(session.session?.user.id as string);

      if (role !== 'admin') {
        navigate('/', { replace: true });
      }

      setRoleLoading(false);
    };

    checkRole();
  }, [navigate]);

  if (isLoading || !session || roleLoading) {
    return (
      <>
        <SeoHead title="Cargando..." description="Cargando el panel de administración" />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f3f4f6', // f3f4f6
          minHeight: '100vh',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <Sidebar />
        <Box
          component="main"
          sx={{
            flex: 1,
            // Solo margen en desktop
            ml: { xs: 0, sm: 0, md: 0, lg: isOpen ? '260px' : '110px' },
            // Padding suave sin márgenes extra
            p: { xs: 1, sm: 2, md: 2 },
            mt: { xs: '60px', lg: 0 },
            transition: 'margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#1e293b',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: { xs: 'calc(100vh - 60px)', lg: '100vh' },
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};