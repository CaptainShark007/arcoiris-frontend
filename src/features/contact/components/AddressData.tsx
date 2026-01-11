import { Box, Typography } from "@mui/material";
import { InfoItem } from "./InfoItem";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationPinIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import { Partner } from "@shared/types";


const DEFAULT_DATA = {
  address: "Av. Edison 352 – Resistencia, Chaco",
  schedule: (
    <>
      <strong>Lunes a Viernes:</strong> 8:00 a 20:00 hs<br />
      <strong>Sábados:</strong> 8:00 a 12:00 hs
    </>
  ),
  phone: "3624049548",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56641.23568840378!2d-59.069974478320326!3d-27.466854899999966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450c96e07e915d%3A0x48c05b3296a7877!2sArco%20Iris%20Ferreter%C3%ADa!5e0!3m2!1ses-419!2sar!4v1760222830139!5m2!1ses-419!2sar" // Tu iframe default
};

const getCleanMapSrc = (input: string | undefined | null) => {
  if (!input) return DEFAULT_DATA.mapUrl;

  if (input.includes('<iframe')) {
    const match = input.match(/src="([^"]+)"/);
    return match ? match[1] : DEFAULT_DATA.mapUrl;
  }

  return input;
};

export const AddressData = ({ partner }: { partner?: Partner | null }) => {
  
  const mapSrc = getCleanMapSrc(partner?.map_url);

  const scheduleContent = partner?.schedule ? (
    <span style={{ whiteSpace: 'pre-line', display: 'block' }}>
      {partner.schedule}
    </span>
  ) : DEFAULT_DATA.schedule;

  const displayData = {
    address: partner?.address || DEFAULT_DATA.address,
    schedule: scheduleContent,
    phone: partner?.phone || DEFAULT_DATA.phone,
  };

  return (
    <Box sx={{ py: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      
      {/* Título opcional si es un socio */}
      {partner && (
        <Box textAlign="center" mb={4}>
           <Typography variant="h5" color="primary" fontWeight="bold">
             Contacta con tu asesor: {partner.name}
           </Typography>
        </Box>
      )}

      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, 
        gap: 6, 
        maxWidth: "1400px", 
        mx: "auto", 
        mb: 6 
      }}>
        
        <InfoItem
          icon={LocationPinIcon}
          title="Ubicación"
          description={displayData.address}
        />

        <InfoItem
          icon={AccessTimeIcon}
          title="Horarios de Atención"
          description={displayData.schedule}
        />

        <InfoItem
          icon={ChatIcon}
          title="Información de Contacto"
          description={
            <><strong>WhatsApp:</strong> {displayData.phone}</>
          }
        />
      </Box>

      {/* Mapa */}
      <Box sx={{ maxWidth: "1400px", mx: "auto", borderRadius: 2, overflow: "hidden", height: 350, boxShadow: 3 }}>
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          title="Mapa de ubicación"
        />
      </Box>
    </Box>
  );
};