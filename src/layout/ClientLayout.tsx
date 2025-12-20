import React from "react";
import { Loader, SeoHead } from "@shared/components";
import { useUsers } from "@shared/hooks";
import { NavLink, Outlet } from "react-router";
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  useMediaQuery, 
  useTheme,
  Typography
} from "@mui/material";
import { useAuthStateChange, useLogout, useRoleUser } from "@features/auth/hooks";

export const ClientLayout = () => {
  const { session, isLoading: isLoadingSession } = useUsers();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(session?.user.id as string);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Maneja cambios de estado de autenticación
  useAuthStateChange();

  // Hook personalizado para logout
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  if (isLoadingSession || isLoadingRole) {
    return (
      <>
        <SeoHead title="Cargando..." description="Cargando información de la cuenta" />
        <Loader />
      </>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* <SeoHead title="Mi cuenta" description="Gestiona tu cuenta y pedidos" /> */}
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Toolbar sx={{ 
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
        }}>
          {/* Título */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              flexShrink: 0,
              color: 'primary.main',
            }}
          >
            Perfil
          </Typography>

          {/* Botones - siempre visibles */}
          <Box sx={{ 
            display: "flex", 
            gap: { xs: 1, sm: 4 },
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: { xs: 1, sm: 'auto' },
          }}>
            <Button
              component={NavLink}
              to="/cuenta/pedidos"
              size={isMobile ? "small" : "medium"}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                "&.active": { fontWeight: 700 },
                minWidth: 'auto',
                px: { xs: 1, sm: 2 },
              }}
            >
              Pedidos
            </Button>

            {role === "admin" && (
              <Button
                component={NavLink}
                to="/panel"
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                  "&.active": { fontWeight: 700 },
                  minWidth: 'auto',
                  px: { xs: 1, sm: 2 },
                }}
              >
                Panel
              </Button>
            )}

            <Button
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                minWidth: 'auto',
                px: { xs: 1, sm: 2 },
              }}
            >
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ flex: 1, px: { xs: 1, sm: 2 } }}>
        <Outlet />
      </Container>
    </Box>
  );
};