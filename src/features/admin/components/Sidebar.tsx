import { signOut } from '@/actions';
import { Box, Button, Link as MuiLink } from '@mui/material';
import { Link, NavLink } from 'react-router';
import logo from '@/assets/images/logo_comercio_v2.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { dashboardLinks } from '@shared/constants/links';

export const Sidebar = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box
      sx={{
        width: { xs: '120px', lg: '250px' },
        backgroundColor: '#0007d7ff',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        p: 2.5,
        position: 'fixed',
        height: '100vh',
      }}
    >
      {/* Logo */}
      <MuiLink
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          gap: 1,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 80 }} />
      </MuiLink>

      <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {dashboardLinks.map((link) => (
          <Box
            key={link.id}
            component={NavLink}
            to={link.href}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: 'flex-start' },
              gap: 1.5,
              pl: { xs: 0, lg: 2.5 },
              py: 1.5,
              transition: 'all 300ms ease',
              borderRadius: 1,
              cursor: 'pointer',
              color: 'white',
              '&.active': {
                color: '#0007d7ff',
                backgroundColor: 'white',
              },
              textDecoration: 'none',
            }}
          >
            {link.icon}
            <Box sx={{ fontWeight: 600, display: { xs: 'none', lg: 'block' } }}>
              {link.title}
            </Box>
          </Box>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: '#ff0000ff',
          py: 1.25,
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#bf0000ff',
          },
        }}
        onClick={handleLogout}
      >
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          Cerrar sesión
        </Box>
        <LogoutIcon sx={{ display: { xs: 'block', lg: 'none' } }} />
      </Button>
    </Box>
  );
};