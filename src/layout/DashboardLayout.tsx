import { Sidebar } from '@features/admin';
import { Outlet, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useUsers } from '@shared/hooks';
import { useEffect, useRef, useState } from 'react';
import { Suspense } from 'react';
import { getSession, getUserRole } from '@/actions';
import { Loader, SeoHead } from '@shared/components';
import { useAuthStateChange } from '@features/auth/hooks';
import { useSidebar } from '@/shared/contexts/useSidebar';

const SIDEBAR_OPEN = 240;
const SIDEBAR_CLOSED = 68;

// Spinner liviano para el Suspense de cada página (no recarga el sidebar)
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      opacity: 0.5,
    }}
  >
    <Box
      sx={{
        width: 32,
        height: 32,
        border: '3px solid #e2e8f0',
        borderTopColor: '#0007d7',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        '@keyframes spin': {
          to: { transform: 'rotate(360deg)' },
        },
      }}
    />
  </Box>
);

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isLoading, session } = useUsers();
  const { isOpen } = useSidebar();
  // Usamos ref para evitar que re-renders del role check destruyan el sidebar
  const [roleLoading, setRoleLoading] = useState(true);
  const checkedRef = useRef(false);

  useAuthStateChange();

  useEffect(() => {
    // Solo ejecutar una vez aunque el efecto re-corra
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkRole = async () => {
      const sess = await getSession();

      if (!sess?.session) {
        navigate('/acceder', { replace: true });
        return;
      }

      const role = await getUserRole(sess.session.user.id);

      if (role !== 'admin') {
        navigate('/', { replace: true });
        return;
      }

      setRoleLoading(false);
    };

    checkRole();
  // navigate es estable en react-router, no es necesario como dep real
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        toastOptions={{ duration: 4000 }}
      />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {/* El Sidebar vive FUERA del Suspense, nunca parpadea */}
        <Sidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            ml: {
              xs: 0,
              lg: isOpen ? `${SIDEBAR_OPEN}px` : `${SIDEBAR_CLOSED}px`,
            },
            p: { xs: 1, sm: 2, md: 2 },
            mt: { xs: '60px', lg: 0 },
            transition: 'margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#1e293b',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: { xs: 'calc(100vh - 60px)', lg: '100vh' },
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/*
            Suspense envuelve solo el Outlet (el contenido de la página lazy).
            El Sidebar queda fuera → no parpadea nunca al navegar.
          */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </>
  );
};