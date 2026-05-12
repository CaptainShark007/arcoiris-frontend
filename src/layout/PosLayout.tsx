// src/layout/PosLayout.tsx
import { Outlet, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useUsers } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { getSession, getUserRole } from '@/actions';
import { Loader, SeoHead } from '@shared/components';
import { useAuthStateChange } from '@features/auth/hooks';

export const PosLayout = () => {
  const navigate = useNavigate();
  const { isLoading, session } = useUsers();
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
        <SeoHead title="Cargando..." description="Cargando punto de venta" />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};