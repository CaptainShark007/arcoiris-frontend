import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo_comercio_v2.png';

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const navButtonStyle = {
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 8,
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#93C5FD',
    },
  };

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    width: 380,
  };

  return (
    <>
      <AppBar position='static' color='primary'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Izquierda: Logo */}
          {/* <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            ARCOIRIS
          </Typography> */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginLeft: 10,
            }}
          >
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

            {/* Centro: Links */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to='/'
                color='inherit'
                sx={navButtonStyle}
              >
                Inicio
              </Button>
              <Button
                component={Link}
                to='/productos'
                color='inherit'
                sx={navButtonStyle}
              >
                Productos
              </Button>
              {/* Dropdown Categorias */}
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
          </Box>

          {/* Derecha: Iconos y Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color='inherit'>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color='inherit'>
              <SearchIcon />
            </IconButton>

            <Typography variant='body2'>
              {/* 🔹 Iniciar sesión abre el modal */}
              <Button
                onClick={() => setOpenLogin(true)}
                sx={{
                  backgroundColor: 'background.paper',
                  color: 'primary.main',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  marginRight: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                Iniciar sesión
              </Button>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal de Login */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <Box sx={modalStyle}>
          <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>
            Iniciar Sesión
          </Typography>
          <Box
            component='form'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField label='Correo electrónico' type='email' fullWidth />
            <TextField label='Contraseña' type='password' fullWidth />
            <Button variant='contained' color='primary' sx={{ mt: 1 }}>
              Ingresar
            </Button>
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 1 }}>
              ¿No tienes una cuenta?{' '}
              <Link
                to='#'
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Registrate
              </Link>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
