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

  useEffect(() => {
    if (!isLoading && session && !hasRedirected) {
      setHasRedirected(true);
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    }
  }, [session, isLoading, navigate, hasRedirected]);

  if (isLoading) return <Loader />;
  if (session && hasRedirected) return null;
  if (session && !hasRedirected) return null;

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 8 }, 
        pb: 4,
        px: { xs: 2, sm: 0 }, 
        display: "flex",
        alignItems: "flex-start",
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
        <Typography 
            variant="h5" 
            fontWeight={600} 
            textAlign="center"
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} 
        >
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
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!email || !password || isPending}
          sx={{ 
            mt: 1,
            py: { xs: 1.5, sm: 1.2 }, 
            fontSize: { xs: '1rem', sm: '0.875rem' }
          }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Iniciar sesión"
          )}
        </Button>

        <Typography variant="body2" textAlign="center">
          <Link
            to="/recuperar-contrasena"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>

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