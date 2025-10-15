import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ProductFilters = () => {
  return (
    <>
      {[
        "Marca",
        "Socket",
        "Tipo de memoria",
        "Tipo de disco ssd",
        "Formato memoria",
      ].map((filtro) => (
        <Accordion
          key={filtro}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            boxShadow: "none",
            "&:before": { display: "none" },
            borderRadius: 1,
            mb: 1,
            bgcolor: "background.paper",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
            <Typography fontWeight="bold" color="text.primary">
              {filtro}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Todos {filtro}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
