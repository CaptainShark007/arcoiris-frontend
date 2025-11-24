import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks";
import { useUsers } from "@shared/hooks";
import { Loader } from "@shared/components";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { session, isLoading } = useUsers();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  // Maneja la redirección después del login
  useEffect(() => {
    // Solo proceder si la sesión se cargó completamente y hay sesión activa
    if (!isLoading && session && !hasRedirected) {
      setHasRedirected(true);
      
      // Verificar si hay una ruta de redirección guardada
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        // Limpiar la ruta de redirección almacenada
        sessionStorage.removeItem("redirectAfterLogin");
        // Redirigir a la ruta guardada
        navigate(redirectPath);
      } else {
        // Redirigir a la página principal si no hay ruta guardada
        navigate("/");
      }
    }
  }, [session, isLoading, navigate, hasRedirected]);

  if (isLoading) return <Loader />;

  // Si ya está logeado y ya fue redirigido, no mostrar nada
  if (session && hasRedirected) return null;

  // Si está logeado pero no fue redirigido (caso inicial), no mostrar login
  if (session && !hasRedirected) return null;

  return (
    <Box
      sx={{
        marginBottom: 4,
        paddingTop: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="form"
        onSubmit={onLogin}
        sx={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Iniciar sesión
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          ¡Qué bueno tenerte de vuelta!
        </Typography>

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!email || !password || isPending}
          sx={{ mt: 1, py: 1.2 }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Iniciar sesión"
          )}
        </Button>

        <Typography variant="body2" textAlign="center">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registrarse"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;