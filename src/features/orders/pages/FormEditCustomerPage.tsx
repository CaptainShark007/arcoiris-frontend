// pages/FormEditUserPage.tsx
import { useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useCustomer, useUsers, useFormWithSchema } from "@shared/hooks";
import { Loader, SeoHead } from "@shared/components";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUpdateCustomer } from "../hooks";
import { UpdateCustomerFormData, updateCustomerSchema } from "../schema/updateCustomerSchema";

const FormEditUserPage = () => {
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useUsers();
  const userId = session?.user.id;

  const { data: customer, isLoading: customerLoading } = useCustomer(userId!);
  const { mutate, isPending } = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useFormWithSchema<UpdateCustomerFormData>({
    schema: updateCustomerSchema,
    defaultValues: {
      full_name: "",
      phone: "",
    },
  });

  // Cargar datos del cliente cuando estén disponibles
  useEffect(() => {
    if (customer) {
      reset({
        full_name: customer.full_name || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, reset]);

  const onSubmit = handleSubmit((data) => {
    if (!customer?.id) return;

    mutate(
      {
        customerId: customer.id,
        fullName: data.full_name,
        phone: data.phone || null,
      },
      {
        onSuccess: () => {
          navigate("/cuenta/pedidos");
        },
      }
    );
  });

  if (sessionLoading || customerLoading) {
    return (
      <>
        <SeoHead title="Cargando perfil..." description="Preparando formulario" />
        <Loader />
      </>
    );
  }

  if (!session || !customer) {
    return null;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 5,
        maxWidth: "800px",
        mx: "auto",
      }}
    >
      <SeoHead title="Editar perfil" description="Modifica la información de tu cuenta" />
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/cuenta/pedidos")}
        sx={{
          mb: 3,
          textTransform: "none",
        }}
      >
        Volver
      </Button>

      <Card
        sx={{
          borderRadius: 1,
          boxShadow: "none",
          border: 1,
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Editar
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Nombre completo */}
              <TextField
                label="Nombre completo"
                fullWidth
                {...register("full_name")}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                disabled={isPending}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: { xs: 48, sm: "auto" },
                  },
                }}
              />

              {/* Teléfono */}
              <TextField
                label="Teléfono"
                fullWidth
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={isPending}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: { xs: 48, sm: "auto" },
                  },
                }}
              />

              {/* Email - Solo lectura */}
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                value={session.user.email || ""}
                disabled
                placeholder={session.user.email || ""}
                helperText="No es posible modificar el email"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: { xs: 48, sm: "auto" },
                    bgcolor: "action.disabledBackground",
                  },
                }}
              />

              {/* Contraseña - Solo lectura con placeholder */}
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                value="••••••••"
                disabled
                helperText="Para cambiar tu contraseña, usa la opción 'Recuperar contraseña' en el inicio de sesión"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: { xs: 48, sm: "auto" },
                    bgcolor: "action.disabledBackground",
                  },
                }}
              />

              {/* Botones */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isValid || isPending}
                  sx={{
                    py: { xs: 1.5, sm: 1.2 },
                    fontSize: { xs: "1rem", sm: "0.875rem" },
                    flex: { xs: 1, sm: "auto" },
                    minWidth: { sm: 150 },
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/cuenta/pedidos")}
                  disabled={isPending}
                  sx={{
                    py: { xs: 1.5, sm: 1.2 },
                    fontSize: { xs: "1rem", sm: "0.875rem" },
                    flex: { xs: 1, sm: "auto" },
                    minWidth: { sm: 100 },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormEditUserPage;