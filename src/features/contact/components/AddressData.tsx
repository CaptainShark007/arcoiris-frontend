import { Box } from "@mui/material";
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
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56641.23568840378!2d-59.069974478320326!3d-27.466854899999966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450c96e07e915d%3A0x48c05b3296a7877!2sArco%20Iris%20Ferreter%C3%ADa!5e0!3m2!1ses-419!2sar!4v1760222830139!5m2!1ses-419!2sar" 
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
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      
      {/* Información Textual */}
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          
          <InfoItem
            icon={LocationPinIcon}
            title="Visítanos"
            description={displayData.address}
          />

          <InfoItem
            icon={AccessTimeIcon}
            title="Horarios"
            description={displayData.schedule}
          />

          <InfoItem
            icon={ChatIcon}
            title="Contacto Directo"
            description={
              <><strong>WhatsApp:</strong> {displayData.phone}</>
            }
          />
        </Box>
      </Box>

      {/* Mapa Integrado */}
      <Box 
        sx={{ 
            flexGrow: 1, 
            minHeight: "300px", 
            borderRadius: 1, 
            overflow: "hidden", 
            boxShadow: 2,
            display: "flex", 
            flexDirection: "column" 
        }}
      >
        <iframe
          src={mapSrc}
          width="100%"
          style={{ border: 0, flex: 1 }}
          loading="lazy"
          title="Mapa de ubicación"
        />
      </Box>
    </Box>
  );
};