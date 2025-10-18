import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useBrands } from "../hooks/products/useBrands";

interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

export const ProductFilters = ({ selectedBrands, setSelectedBrands }: Props) => {

  //const brands = ["Intel", "AMD", "ASUS", "MSI", "Gigabyte"]; // se podrían obtenerlas dinámicamente

  const { brands, isLoading } = useBrands();

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <>
      <Accordion
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
            Marca
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                }
                label={brand}
              />
            ))}
          </FormGroup>
        )}
      </AccordionDetails>
      </Accordion>
    </>
  );
};
