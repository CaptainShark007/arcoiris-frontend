import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Fab, Tooltip } from "@mui/material";

export const WhatsappButton = () => {
  const handleClick = () => {
    window.open("https://w.app/zo5esm", "_blank");
  };

  return (
    <Tooltip title="Contáctanos por WhatsApp" placement="left">
      <Fab
        color="success"
        aria-label="whatsapp"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 40,
          bgcolor: "#25D366",
          "&:hover": {
            bgcolor: "#1EBE57",
          },
        }}
      >
        <WhatsAppIcon sx={{ color: "white" }} />
      </Fab>
    </Tooltip>
  );
};
