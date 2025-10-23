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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo_comercio_v2.png';
import { NotificationPopup } from './PopupNotification';
import { useUsers } from '@shared/hooks';
import { Loader } from './Loader';
import LoginIcon from '@mui/icons-material/Login';

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { session, isLoading } = useUsers();

  const userId = session?.user?.id;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClick = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const navButtonStyle = {
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'text.primary', // #93C5FD
    },
  };

  return (
    <>
      <AppBar position='static' color='primary'>
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
            <img src={logo} alt='Logo' style={{ height: 50 }} />
          </Box>

          {/* Links centrales: solo visibles en pantallas grandes */}
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
              <MenuItem
                component={Link}
                to='/categorias/electronicas'
                onClick={handleClose}
              >
                Electronica
              </MenuItem>
              <MenuItem
                component={Link}
                to='/categorias/ropas'
                onClick={handleClose}
              >
                Ropas
              </MenuItem>
              <MenuItem
                component={Link}
                to='/categorias/hogar'
                onClick={handleClose}
              >
                Hogar
              </MenuItem>
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
            {/* Iconos solo en pantallas grandes */}
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              onClick={handleSnackbarClick}
            >
              <ShoppingCartIcon />
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
              onClick={handleSnackbarClick}
            >
              <SearchIcon />
            </IconButton>

            {/* Iconos solo visibles en pantallas chicas */}
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={handleSnackbarClick}
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              color='inherit'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={handleSnackbarClick}
            >
              <FavoriteBorderIcon />
            </IconButton>

            {/* Botón de perfil/login */}
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
                D
              </Box>
            ) : (
              <>
                {/* Botón de texto en pantallas grandes */}
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
                {/* Icono en pantallas pequeñas */}
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
            {/* Botón de menú hamburguesa */}
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

      {/* Drawer para móvil */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        //sx={{ backgroundColor: 'primary.main' }}
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
              to='/productos'
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary='Productos' />
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

      {/* Snackbar para notificaciones */}
      <NotificationPopup
        open={openSnackbar}
        message='Próximamente'
        severity='info'
        onClose={handleSnackbarClose}
      />
    </>
  );
};
