import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useBrands } from '../hooks/products/useBrands';
import { useCategories } from '../hooks/products/useCategories';

interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedCategories: string[]; // ← Nuevo
  setSelectedCategories: (categories: string[]) => void; // ← Nuevo
}

/* interface Props {
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[]; // ← Nuevo
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>; // ← Nuevo
} */

export const ProductFilters = ({
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
}: Props) => {
  //const brands = ["Intel", "AMD", "ASUS", "MSI", "Gigabyte"]; // se podrían obtenerlas dinámicamente

  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { brands, isLoading: isLoadingBrands } = useBrands();

  /* const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => 
    prev.includes(categoryId)
      ? prev.filter((id) => id !== categoryId)
      : [...prev, categoryId]
    );
  } */

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  }

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <>
      {/* Filtro por Categorías */}
      <Accordion 
        //defaultExpanded
        //defaultExpanded
        //disableGutters // Quita el borde superior que aparece por defecto
        elevation={0}
        sx={{
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          borderRadius: 1,
          mb: 1,
          //bgcolor: 'red',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color='primary' />}>
          <Typography fontWeight={600}>Categorías</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isLoadingCategories ? (
            <CircularProgress size={24} />
          ) : (
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      size="small"
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Filtros por marcas */}
      <Accordion
        //defaultExpanded
        //disableGutters
        elevation={0}
        sx={{
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          borderRadius: 1,
          mb: 1,
          //bgcolor: 'red',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color='primary' />}>
          <Typography fontWeight='bold' color='text.primary'>
            Marca
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isLoadingBrands ? (
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
