import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useBrands } from '../hooks/products/useBrands';
import { useCategories } from '../hooks/products/useCategories';
import { useEffect, useState } from 'react';

interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export const ProductFilters = ({
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
}: Props) => {

  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { brands, isLoading: isLoadingBrands } = useBrands();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const [categoriesOpen, setCategoriesOpen] = useState(isDesktop);
  //const [brandsOpen, setBrandsOpen] = useState(isDesktop);

  useEffect(() => {
    setCategoriesOpen(isDesktop);
    //setBrandsOpen(isDesktop);
  }, [isDesktop]);

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
        elevation={0}
        expanded={categoriesOpen}
        onChange={() => setCategoriesOpen(!categoriesOpen)}
        sx={{
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          borderRadius: 1,
          mb: 1,
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
        elevation={0}
        //expanded={brandsOpen}
        //onChange={() => setBrandsOpen(!brandsOpen)}
        sx={{
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          borderRadius: 1,
          mb: 1,
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
