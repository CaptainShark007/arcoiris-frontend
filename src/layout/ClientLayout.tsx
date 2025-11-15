import { signOut } from '@/actions';
import { supabase } from '@/supabase/client';
import { Loader } from '@shared/components';
import { useUsers } from '@shared/hooks';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

export const ClientLayout = () => {
  const { isLoading: isLoadingSession } = useUsers(); // session, 

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/acceder');
      }
    });
  }, [navigate]); */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          navigate('/');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  if (isLoadingSession) return <Loader />;

  const handleLogout = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: ['users'] }); // limpia la cache
    navigate('/');
  };

  return (
    <Box display='flex' flexDirection='column' gap={3}>
      {/* Menu */}
      <AppBar
        position='static'
        elevation={0}
        color='transparent'
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', gap: 4 }}>
          <Button
            component={NavLink}
            to='/cuenta/pedidos'
            sx={{
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&.active': { textDecoration: 'underline' },
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Pedidos
          </Button>

          {/* TODO: LINK DASHBOARD */}
          <Button
            onClick={handleLogout}
            sx={{
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container sx={{ flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
