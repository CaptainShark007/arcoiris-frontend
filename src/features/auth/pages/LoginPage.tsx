import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useLogin();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <Box
      sx={{
        //minHeight: "100vh",
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
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
