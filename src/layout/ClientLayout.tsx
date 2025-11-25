import { Loader } from "@shared/components";
import { useUsers } from "@shared/hooks";
import { NavLink, Outlet } from "react-router";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { useAuthStateChange, useLogout, useRoleUser } from "@features/auth/hooks";

export const ClientLayout = () => {
  const { session, isLoading: isLoadingSession } = useUsers();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(session?.user.id as string);

  // Maneja cambios de estado de autenticación
  useAuthStateChange();

  // Hook personalizado para logout
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  if (isLoadingSession || isLoadingRole) return <Loader />;

  return (
    <Box display="flex" flexDirection="column" gap={3} >
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
        <Toolbar sx={{ justifyContent: "center", gap: 4 }}>
          <Button
            component={NavLink}
            to="/cuenta/pedidos"
            sx={{
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
              "&.active": { fontWeight: 700 },
              //"&:hover": { textDecoration: "underline" },
            }}
          >
            Pedidos
          </Button>

          {
            role === "admin" && (
              <Button
                component={NavLink}
                to="/panel"
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&.active": { fontWeight: 700 },
                  //"&:hover": { textDecoration: "underline" },
                }}
              >
                Panel Administrador
              </Button>
            )
          }

          <Button
            onClick={() => handleLogout()}
            disabled={isLoggingOut}
            sx={{
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
              //"&:hover": { textDecoration: "underline" },
            }}
          >
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};