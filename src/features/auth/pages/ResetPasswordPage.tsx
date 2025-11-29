// pages/ResetPasswordPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { useUpdatePassword } from "../hooks";
import { useUsers } from "@shared/hooks";
import { Loader } from "@shared/components";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate, isPending } = useUpdatePassword();
  const { session, isLoading } = useUsers();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    mutate(password);
  };

  if (isLoading) return <Loader />;
  
  // Si no hay sesión, el usuario no viene del link de recuperación
  if (!session) return <Navigate to="/acceder" />;

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
          Nueva contraseña
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          Ingresa tu nueva contraseña para tu cuenta.
        </Typography>

        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
          inputProps={{ minLength: 6 }}
          sx={{ "& .MuiInputBase-root": { minHeight: { xs: 48, sm: "auto" } } }}
        />

        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isPending}
          required
          inputProps={{ minLength: 6 }}
          sx={{ "& .MuiInputBase-root": { minHeight: { xs: 48, sm: "auto" } } }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!password || !confirmPassword || isPending}
          sx={{
            mt: 1,
            py: { xs: 1.5, sm: 1.2 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
          }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Actualizar contraseña"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;