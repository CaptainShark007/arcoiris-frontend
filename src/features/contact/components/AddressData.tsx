import { Box } from "@mui/material";
import { InfoItem } from "./InfoItem";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationPinIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';

export const AddressData = () => {
  return (
    <Box sx={{ 
      py: { xs: 4, sm: 5, md: 6 },
      px: { xs: 2, sm: 3, md: 4 },
    }}>
      {/* Contenedor de ítems */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 4, sm: 5, md: 6 },
          justifyItems: "center",
          maxWidth: "1400px",
          mx: "auto",
          mb: { xs: 4, md: 6 },
        }}
      >
        <InfoItem
          icon={LocationPinIcon}
          title="Ubicación"
          description="Av. Edison 352 – Resistencia, Chaco"
        />

        <InfoItem
          icon={AccessTimeIcon}
          title="Horarios de Atención"
          description={
            <>
              <strong>Lunes a Viernes:</strong> 8:00 a 20:00 hs
              <br />
              <strong>Sábados:</strong> 8:00 a 12:00 hs
            </>
          }
        />

        <InfoItem
          icon={ChatIcon}
          title="Información de Contacto"
          description={
            <>
              <strong>WhatsApp:</strong> 3624105888
            </>
          }
        />
      </Box>

      {/* Mapa */}
      <Box 
        sx={{ 
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          boxShadow: { xs: 0, sm: 2 },
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56641.23568840378!2d-59.069974478320326!3d-27.466854899999966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450c96e07e915d%3A0x48c05b3296a7877!2sArco%20Iris%20Ferreter%C3%ADa!5e0!3m2!1ses-419!2sar!4v1760222830139!5m2!1ses-419!2sar"
          width="100%"
          height="350"
          style={{ 
            border: 0,
            display: "block",
          }}
          loading="lazy"
          title="Mapa de ubicación Arco Iris Ferretería"
        />
      </Box>
    </Box>
  );
};