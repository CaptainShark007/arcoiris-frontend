import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationPopup } from './NotificationPopup';
import { useCustomer, useUsers } from '@shared/hooks';
import { Loader } from './Loader';
import LoginIcon from '@mui/icons-material/Login';
import { useCartStore } from '../../storage/useCartStore';
import { CartSidebar } from './CartSidebar';
import { HeaderSearch } from './HeaderSearch';
import { useCategories } from '@features/shop/hooks/products/useCategories';

export const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);

  const { session, isLoading } = useUsers();
  const totalQuantity = useCartStore((state) => state.totalQuantity);

  const userId = session?.user?.id;

  const { data: customer, isLoading: isLoadingCustomer } = useCustomer(userId);

  const initial = customer?.full_name?.[0]?.toUpperCase() || 'U';

  const { categories, isLoading: isLoadingCategories } = useCategories();

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/tienda?categoryId=${categoryId}`);
    handleClose();
  }

  const handleSnackbarClick = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSearchOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const navButtonStyle = {
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'text.primary',
    },
  };

  return (
    <>
      <AppBar position='fixed' color='primary'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={Link}
            to='/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1,
            }}
          >
            <img src='/logo_comercio_v2.png' alt='Logo' style={{ height: 50 }} />
          </Box>

          {/* Links centrales */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button component={Link} to='/' color='inherit' sx={navButtonStyle}>
              Inicio
            </Button>
            <Button
              component={Link}
              to='/tienda'
              color='inherit'
              sx={navButtonStyle}
            >
              Tienda Virtual
            </Button>
            <Button
              color='inherit'
              endIcon={<ArrowDropDownIcon />}
              onClick={handleOpen}
              sx={navButtonStyle}
            >
              Categorias
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {isLoadingCategories ? (
                <MenuItem>Cargando...</MenuItem>
              ) : (
                categories?.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    {cat.name}
                  </MenuItem>
                ))
              )}
            </Menu>
            <Button
              component={Link}
              to='/contacto'
              color='inherit'
              sx={navButtonStyle}
            >
              Contacto
            </Button>
          </Box>

          {/* Iconos y Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={() => setCartSidebarOpen(true)}
            >
              <Badge badgeContent={totalQuantity} color='error'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={handleSnackbarClick}
            >
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={handleSearchOpen}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              color='inherit'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={() => setCartSidebarOpen(true)}
            >
              <Badge badgeContent={totalQuantity} color='error'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={handleSearchOpen}
            >
              <SearchIcon />
            </IconButton>

            {isLoading ? (
              <Loader />
            ) : session ? (
              <Box
                component={Link}
                to='/cuenta'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '2px solid white',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 18,
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                {isLoadingCustomer ? "?" : initial}
              </Box>
            ) : (
              <>
                <Button
                  component={Link}
                  to='/acceder'
                  sx={{
                    backgroundColor: 'white',
                    padding: '8px 14px',
                    marginRight: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  Iniciar sesión
                </Button>
                <IconButton
                  component={Link}
                  to='/acceder'
                  color='inherit'
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  <LoginIcon />
                </IconButton>
              </>
            )}
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Espaciador para el AppBar fijo */}

      {/* Drawer para móvil */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 1 }}
      >
        <List
          sx={{
            width: 250,
            bgcolor: 'primary.main',
            color: 'white',
            height: '100%',
          }}
        >
          <ListItem>
            <ListItemButton
              component={Link}
              to='/'
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary='Inicio' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to='/tienda'
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary='Tienda Virtual' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component='button' onClick={handleOpen}>
              <ListItemText primary='Categorias' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to='/contacto'
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary='Contacto' />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <NotificationPopup
        open={openSnackbar}
        message='Próximamente'
        severity='info'
        onClose={handleSnackbarClose}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />

      {/* Header Search */}
      <HeaderSearch
        anchorEl={searchAnchorEl}
        open={Boolean(searchAnchorEl)}
        onClose={handleSearchClose}
      />
    </>
  );
};
