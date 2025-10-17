import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    width: 380,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Iniciar Sesión
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField label="Correo electrónico" type="email" fullWidth />
          <TextField label="Contraseña" type="password" fullWidth />
          <Button variant="contained" color="primary" sx={{ mt: 1 }}>
            Ingresar
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            ¿No tienes una cuenta?{" "}
            <Link to="#" style={{ color: "#1976d2", textDecoration: "none" }}>
              Registrate
            </Link>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
