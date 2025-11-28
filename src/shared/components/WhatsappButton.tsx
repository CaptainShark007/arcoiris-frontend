import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Fab, Tooltip } from "@mui/material";

export const WhatsappButton = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Hola! Tengo una consulta sobre un producto.");
    const phone = "5493624049548";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
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
