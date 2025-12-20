import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useRegister } from "../hooks";
import { useFormWithSchema, useUsers } from "@shared/hooks";
import { RegisterFormData, registerSchema } from "../schemas/registerSchema";
import { Loader, SeoHead } from "@shared/components";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useFormWithSchema<RegisterFormData>({
    schema: registerSchema,
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const { mutate, isPending } = useRegister();
  const { session, isLoading } = useUsers();

  const onRegister = handleSubmit((data) => {
    const { email, password, fullName, phoneNumber } = data;
    mutate({ email, password, fullName, phoneNumber });
  });

  //if (isLoading) return <Loader />;
  if (isLoading) {
    return (
      <>
        <SeoHead title="Crear cuenta" description="Regístrate en Arcoiris Shop" />
        <Loader />
      </>
    );
  }

  if (session) return <Navigate to="/" />;

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
      <SeoHead title="Crear cuenta" description="Únete a Arcoiris Shop y disfruta de nuestros productos" />
      <Box
        component="form"
        onSubmit={onRegister}
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
          Crear cuenta
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          ¡Bienvenido! Completa el siguiente formulario para registrarte.
        </Typography>

        <TextField
          label="Nombre completo"
          fullWidth
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <TextField
          label="Celular"
          fullWidth
          {...register("phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ '& .MuiInputBase-root': { minHeight: { xs: 48, sm: 'auto' } } }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!isValid || isPending}
          sx={{ 
            mt: 1, 
            py: { xs: 1.5, sm: 1.2 },
            fontSize: { xs: '1rem', sm: '0.875rem' }
          }}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Registrarse"
          )}
        </Button>

        <Typography variant="body2" textAlign="center">
          ¿Ya tienes una cuenta?{" "}
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

export default RegisterPage;