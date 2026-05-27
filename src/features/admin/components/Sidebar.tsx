import { Box, Drawer, IconButton, Tooltip } from '@mui/material';
import { NavLink, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { dashboardLinks } from '@shared/constants/links';
import { useAuthStateChange, useLogout } from '@features/auth/hooks';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useMediaQuery, useTheme } from '@mui/material';

const SIDEBAR_OPEN_WIDTH = 240;
const SIDEBAR_CLOSED_WIDTH = 68;
const BRAND_COLOR = '#0007d7';
const BRAND_DARK = '#0005a8';

export const Sidebar = () => {
  useAuthStateChange();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const { isOpen, toggleSidebar, setIsOpen } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const closeOnMobile = () => {
    if (isMobile) setIsOpen(false);
  };

  const navItemSx = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    px: '10px',
    py: '9px',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    transition: 'background 200ms ease, color 200ms ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'white',
    },
    '&.active': {
      backgroundColor: 'rgba(255,255,255,0.15)',
      color: 'white',
      fontWeight: 600,
    },
  };

  const iconSx = {
    minWidth: '24px',
    minHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': { fontSize: '1.25rem' },
  };

  const labelSx = {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    transition: 'opacity 250ms ease, width 250ms ease',
    opacity: isOpen ? 1 : 0,
    width: isOpen ? 'auto' : 0,
    overflow: 'hidden',
  };

  const sidebarContent = (forcedOpen?: boolean) => {
    const open = forcedOpen !== undefined ? forcedOpen : isOpen;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 2,
          px: 1.25,
          gap: 0.5,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            px: 1,
            mb: 1.5,
            minHeight: 40,
          }}
        >
          {open && (
            <Box
              sx={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Admin
            </Box>
          )}
          {/* Toggle desktop / Close mobile */}
          <IconButton
            onClick={isMobile ? () => setIsOpen(false) : toggleSidebar}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              transition: 'transform 300ms ease, background 200ms ease',
              transform: open && !isMobile ? 'rotate(0deg)' : 'rotate(180deg)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
              },
            }}
          >
            {isMobile ? <CloseIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>

        {/* POS button */}
        <Tooltip title={open ? '' : 'Punto de Venta'} placement="right" arrow>
          <Box
            component={Link}
            to="/panel/punto-de-venta"
            onClick={closeOnMobile}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              px: '10px',
              py: '9px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: 'black',
              textDecoration: 'none',
              backgroundColor: 'rgba(255,255,255,0.9)',
              mb: 1,
              transition: 'background 200ms ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Box sx={iconSx}>
              <PointOfSaleIcon />
            </Box>
            <Box sx={{ ...labelSx, opacity: open ? 1 : 0, width: open ? 'auto' : 0, fontWeight: 600, fontSize: '0.875rem' }}>
              Punto de Venta
            </Box>
          </Box>
        </Tooltip>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', mx: 1, mb: 1 }} />

        {/* Nav links */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {dashboardLinks.map((link) => (
            <Tooltip key={link.id} title={open ? '' : link.title} placement="right" arrow>
              <Box
                component={NavLink}
                to={link.href}
                end={link.href === '/panel'}
                onClick={closeOnMobile}
                sx={navItemSx}
              >
                <Box sx={iconSx}>{link.icon}</Box>
                <Box sx={{ ...labelSx, opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}>
                  {link.title}
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', mx: 1, mb: 0.5 }} />

          <Tooltip title={open ? '' : 'Salir del Panel'} placement="right" arrow>
            <Box
              component={Link}
              to="/"
              onClick={closeOnMobile}
              sx={{
                ...navItemSx,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <Box sx={iconSx}><StorefrontIcon /></Box>
              <Box sx={{ ...labelSx, opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}>
                Salir del Panel
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title={open ? '' : 'Cerrar sesión'} placement="right" arrow>
            <Box
              onClick={() => {
                handleLogout();
                if (isMobile) setIsOpen(false);
              }}
              sx={{
                ...navItemSx,
                color: 'rgba(255, 120, 120, 0.85)',
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                opacity: isLoggingOut ? 0.6 : 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 80, 80, 0.15)',
                  color: '#ff9090',
                },
              }}
            >
              <Box sx={iconSx}><LogoutIcon /></Box>
              <Box sx={{ ...labelSx, opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}>
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: `${SIDEBAR_OPEN_WIDTH}px`,
            backgroundColor: BRAND_COLOR,
            color: 'white',
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
        // Evita que el drawer recargue el layout al abrirse
        keepMounted
      >
        {sidebarContent(true)}
      </Drawer>

      {/* Desktop fixed sidebar */}
      <Box
        component="nav"
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          width: isOpen ? `${SIDEBAR_OPEN_WIDTH}px` : `${SIDEBAR_CLOSED_WIDTH}px`,
          backgroundColor: BRAND_COLOR,
          color: 'white',
          position: 'fixed',
          height: '100vh',
          top: 0,
          left: 0,
          transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          zIndex: 1200,
          boxShadow: '4px 0 20px rgba(0,0,30,0.18)',
        }}
      >
        {sidebarContent()}
      </Box>

      {/* Mobile hamburger */}
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          display: { xs: 'flex', lg: 'none' },
          position: 'fixed',
          top: 14,
          left: 14,
          zIndex: 1300,
          backgroundColor: BRAND_COLOR,
          color: 'white',
          width: 40,
          height: 40,
          boxShadow: '0 2px 10px rgba(0,0,180,0.3)',
          '&:hover': { backgroundColor: BRAND_DARK },
        }}
      >
        <MenuIcon fontSize="small" />
      </IconButton>
    </>
  );
};