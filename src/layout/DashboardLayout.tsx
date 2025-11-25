import { Sidebar } from '@features/admin';
import { Outlet, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useUsers } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { getSession, getUserRole } from '@/actions';
import { Loader } from '@shared/components';
import { useAuthStateChange } from '@features/auth/hooks';

export const DashboardLayout = () => {

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
    }

    checkRole();

  }, [navigate]);

  if (isLoading || !session || roleLoading) return <Loader />;

  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          /* style: {
            background: '#363636',
            color: '#fff',
          }, */
        }}
      />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <Sidebar />
        <Box
          component='main'
          sx={{
            flex: 1,
            ml: { xs: '140px', lg: '270px' },
            mt: 7,
            mx: 5,
            color: '#1e293b',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};
