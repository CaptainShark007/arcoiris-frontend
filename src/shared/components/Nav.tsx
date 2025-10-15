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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from '@mui/icons-material/Login';
import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo_comercio_v2.png";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const navButtonStyle = {
    textTransform: "none",
    fontWeight: 500,
    borderRadius: 8,
    "&:hover": {
      backgroundColor: "transparent",
      color: "text.primary", // #93C5FD
    },
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    width: 380,
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              gap: 1,
            }}
          >
            <img src={logo} alt="Logo" style={{ height: 50 }} />
          </Box>

          {/* Links centrales: solo visibles en sm+ */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button component={Link} to="/" color="inherit" sx={navButtonStyle}>
              Inicio
            </Button>
            <Button
              component={Link}
              to="/tienda"
              color="inherit"
              sx={navButtonStyle}
            >
              Tienda Virtual
            </Button>
            <Button
              color="inherit"
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
                to="/categorias/electronicas"
                onClick={handleClose}
              >
                Electronica
              </MenuItem>
              <MenuItem
                component={Link}
                to="/categorias/ropas"
                onClick={handleClose}
              >
                Ropas
              </MenuItem>
              <MenuItem
                component={Link}
                to="/categorias/hogar"
                onClick={handleClose}
              >
                Hogar
              </MenuItem>
            </Menu>
            <Button
              component={Link}
              to="/contacto"
              color="inherit"
              sx={navButtonStyle}
            >
              Contacto
            </Button>
          </Box>

          {/* Iconos y Auth */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <SearchIcon />
            </IconButton>

            <Button
              onClick={() => setOpenLogin(true)}
              sx={{
                backgroundColor: "white",
                padding: "8px 14px",
                marginRight: "8px",
                textTransform: "none",
                fontWeight: 600,
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              Iniciar sesión
            </Button>

            {/* Botones visibles en celulares */}
            {/* Boton de carrito */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <ShoppingCartIcon />
            </IconButton>
            {/* Boton de favoritos */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <FavoriteBorderIcon />
            </IconButton>
            {/* Boton de inicio de sesion */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "flex", sm: "none" } }}
              onClick={() => { setOpenLogin(true) }}
            >
              <LoginIcon />
            </IconButton>
            {/* Boton de menu hamburguesa */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "flex", sm: "none" } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        //sx={{ backgroundColor: 'primary.main' }}
      >
        <List sx={{ width: 250, bgcolor: "primary.main", color: "white", height: '100%' }}>
          <ListItem>
            <ListItemButton
              component={Link}
              to="/"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to="/productos"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Productos" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="button" onClick={handleOpen}>
              <ListItemText primary="Categorias" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to="/contacto"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Contacto" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => {
                setOpenLogin(true);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Iniciar sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Modal Login */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Iniciar Sesión
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField label="Correo electrónico" type="email" fullWidth />
            <TextField label="Contraseña" type="password" fullWidth />
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
              Ingresar
            </Button>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
              ¿No tienes una cuenta?{" "}
              <Link to="#" style={{ color: "#1976d2", textDecoration: "none" }}>
                Registrate
              </Link>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
