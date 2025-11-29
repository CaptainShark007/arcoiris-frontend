// pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";

import { useUsers } from "@shared/hooks";
import { Loader } from "@shared/components";
import { useRequestPasswordReset } from "../hooks";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { mutate, isPending } = useRequestPasswordReset();
  const { session, isLoading } = useUsers();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(email, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  if (isLoading) return <Loader />;
  if (session) return <Navigate to="/" />;

  if (emailSent) {
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
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            ✅ Email enviado
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Revisa tu correo electrónico. Te hemos enviado un enlace para
            restablecer tu contraseña.
          </Typography>

          <Button
            variant="outlined"
            component={Link}
            to="/acceder"
            sx={{ mt: 2 }}
          >
            Volver al inicio de sesión
          </Button>
        </Box>
      </Box>
    );
  }

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
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
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
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Recuperar contraseña
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </Typography>

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
          sx={{ "& .MuiInputBase-root": { minHeight: { xs: 48, sm: "auto" } } }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!email || isPending}
          sx={{
            mt: 1,
            py: { xs: 1.5, sm: 1.2 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
          }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Enviar enlace de recuperación"
          )}
        </Button>

        <Typography variant="body2" textAlign="center">
          ¿Recordaste tu contraseña?{" "}
          <Link
            to="/acceder"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Inicia sesión aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;