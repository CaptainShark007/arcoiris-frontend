import { Box, Button, Link as MuiLink, Drawer, IconButton } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
//import logo from '../../../../public/logo_comercio_v2.png';
import { dashboardLinks } from '@shared/constants/links';
import { useAuthStateChange, useLogout } from '@features/auth/hooks';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useMediaQuery, useTheme } from '@mui/material';

export const Sidebar = () => {
  useAuthStateChange();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const { isOpen, toggleSidebar, setIsOpen } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleNavigation = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        height: '100%',
        position: 'relative',
        p: { xs: 2.5, lg: 1.5 },
      }}
    >
      {/* Botón cerrar (visible solo en mobile drawer) */}
      <IconButton
        onClick={() => setIsOpen(false)}
        sx={{
          display: { xs: 'flex', lg: 'none' },
          color: 'white',
          p: 1,
          mb: 1,
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Botón toggle (visible solo en desktop) */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          color: 'white',
          p: 1,
          mb: 1,
          transition: 'all 300ms ease',
          transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            transform: isOpen ? 'rotate(-5deg)' : 'rotate(185deg)',
          },
          '& svg': {
            fontSize: '1.8rem',
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Logo */}
      <MuiLink
        component={Link}
        to="/"
        onClick={handleNavigation}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          color: 'inherit',
          gap: 1,
          width: '80px',
          height: '80px',
          flexShrink: 0,
          mt: { xs: 2, lg: 0 },
        }}
      >
        <img 
          //src={logo} 
          src='/logo_comercio_v2.png'
          alt="Logo" 
          style={{ 
            height: '80px',
            width: '80px',
            objectFit: 'contain'
          }} 
        />
      </MuiLink>

      {/* Links de navegación */}
      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {dashboardLinks.map((link) => (
          <Box
            key={link.id}
            component={NavLink}
            to={link.href}
            onClick={handleNavigation}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: isOpen ? 'flex-start' : 'center' },
              gap: 1.5,
              p: 2,
              transition: 'all 300ms ease',
              borderRadius: 1,
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
              '&.active': {
                color: '#0007d7ff',
                backgroundColor: 'white',
              },
            }}
          >
            {link.icon}
            <Box
              sx={{
                fontWeight: 600,
                display: { xs: 'block', lg: isOpen ? 'block' : 'none' },
                whiteSpace: 'nowrap',
              }}
            >
              {link.title}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Botón logout */}
      <Button
        fullWidth
        variant="contained"
        disabled={isLoggingOut}
        sx={{
          backgroundColor: '#ff0000ff',
          py: 1.25,
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', lg: isOpen ? 'flex-start' : 'center' },
          px: { xs: 1, lg: isOpen ? 2 : 1 },
          transition: 'all 300ms ease',
          '&:hover': {
            backgroundColor: '#bf0000ff',
          },
          '&:disabled': {
            backgroundColor: '#ff6666ff',
            color: 'white',
          },
        }}
        onClick={() => {
          handleLogout();
          if (isMobile) {
            setIsOpen(false);
          }
        }}
      >
        <Box sx={{ display: { xs: 'block', lg: isOpen ? 'block' : 'none' } }}>
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Box>
        <LogoutIcon sx={{ display: { xs: 'none', lg: isOpen ? 'none' : 'block' } }} />
      </Button>
    </Box>
  );

  return (
    <>
      {/* Drawer para mobile (< lg) */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: '280px',
            backgroundColor: '#0007d7ff',
            color: 'white',
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Sidebar fijo para desktop (>= lg) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: isOpen ? '260px' : '110px',
          backgroundColor: '#0007d7ff',
          color: 'white',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'fixed',
          height: '100vh',
          transition: 'width 400ms ease',
          overflow: 'auto',
          zIndex: 1200,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Botón hamburguesa para mobile */}
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          display: { xs: 'flex', lg: 'none' },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: '#0007d7ff',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0005a0ff',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};