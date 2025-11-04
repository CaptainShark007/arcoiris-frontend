import React from 'react';
import { Box, Button, Typography, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number; 
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>; 
  itemsPerPageOptions?: number[]; 
}

export const Pagination = ({
  totalItems,
  page,
  setPage,
  itemsPerPage, 
  setItemsPerPage, 
  itemsPerPageOptions = [4, 8, 12, 16, 20], 
}: Props) => {
  //const itemsPerPage = 8;
  
  const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  const handleItemsPerPageChange = (event: any) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Resetear a la primera página
  };

  // Función para obtener las páginas visibles con puntos suspensivos
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];

    // Calcular el rango de páginas alrededor de la actual
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // Agregar primera página y puntos si es necesario
    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    // Agregar última página y puntos si es necesario
    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Box
      component="nav"
      aria-label="Paginación"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 4,
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Información y selector de items por página */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0
            ? `Mostrando ${startItem}-${endItem} de ${totalItems} productos`
            : "No hay productos para mostrar"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Mostrar:
          </Typography>
          <FormControl size="small">
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              sx={{ minWidth: 70 }}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => setPage(1)}
            disabled={page <= 1}
            size="small"
            aria-label="Primera página"
          >
            <FirstPage />
          </IconButton>

          <IconButton
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            size="small"
            aria-label="Página anterior"
          >
            <KeyboardArrowLeft />
          </IconButton>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {getVisiblePages().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === "..." ? (
                  <Typography
                    variant="body2"
                    sx={{ px: 1, py: 0.5, color: "text.secondary" }}
                  >
                    ...
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    variant={pageNumber === page ? "contained" : "text"}
                    onClick={() => setPage(pageNumber as number)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: 1,
                    }}
                  >
                    {pageNumber}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </Box>

          <IconButton
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            size="small"
            aria-label="Página siguiente"
          >
            <KeyboardArrowRight />
          </IconButton>

          <IconButton
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            size="small"
            aria-label="Última página"
          >
            <LastPage />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
