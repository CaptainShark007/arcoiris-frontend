import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks";
import { useFormWithSchema } from "@shared/hooks";
import { RegisterFormData, registerSchema } from "../schemas/registerSchema";

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

  const onRegister = handleSubmit((data) => {
    const { email, password, fullName, phoneNumber } = data;
    mutate({ email, password, fullName, phoneNumber });
  });

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
        onSubmit={onRegister}
        sx={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Crear cuenta
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          ¡Bienvenido! Completa el siguiente formulario para registrarte.
        </Typography>

        <TextField
          label="Nombre completo"
          fullWidth
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

        <TextField
          label="Celular (opcional)"
          fullWidth
          {...register("phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!isValid || isPending}
          sx={{ mt: 1, py: 1.2 }}
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
