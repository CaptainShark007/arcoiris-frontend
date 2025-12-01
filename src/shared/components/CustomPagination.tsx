import React from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

export default function CustomPagination({
  page,
  totalPages,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}: CustomPaginationProps) {
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalItems);

  const handleRowsPerPageChange = (event: any) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        // Responsive: Columna en móvil (xs), Fila en tablet/desktop (md)
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        gap: 2,
      }}
    >
      {/* SECCIÓN IZQUIERDA: Información y Selector de Filas */}
      <Box 
        sx={{ 
          display: 'flex', 
          // Responsive: Apilar info en pantallas muy pequeñas, fila en el resto
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center', 
          gap: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          Mostrando {startItem}-{endItem} de {totalItems} resultados
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            Filas:
          </Typography>
          <FormControl size='small'>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              sx={{ minWidth: 70 }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* SECCIÓN DERECHA: Botones de Navegación */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          {/* Botón: Ir al inicio */}
          <IconButton
            onClick={() => onPageChange(0)}
            disabled={page === 0}
            size='small'
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <FirstPage />
          </IconButton>

          {/* Botón: Anterior */}
          <IconButton
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            size='small'
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          {/* LISTA DE NÚMEROS: Oculta en móvil (xs), Visible en tablet (sm) en adelante */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
            {getVisiblePages().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <Typography
                    variant='body2'
                    sx={{ px: 1, py: 0.5, color: 'text.secondary' }}
                  >
                    ...
                  </Typography>
                ) : (
                  <Button
                    size='small'
                    variant={pageNumber === page + 1 ? 'contained' : 'outlined'} // Cambié 'text' por 'outlined' para mejor visibilidad
                    color={pageNumber === page + 1 ? 'primary' : 'inherit'}
                    onClick={() => onPageChange((pageNumber as number) - 1)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      p: 0,
                      borderColor: pageNumber === page + 1 ? 'primary.main' : 'divider',
                      color: pageNumber === page + 1 ? 'white' : 'text.primary'
                    }}
                  >
                    {pageNumber}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </Box>
          
          {/* TEXTO SOLO MÓVIL: Para saber en qué pagina estás si no se ven los números */}
          <Typography 
            variant="body2" 
            sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 'bold' }}
          >
            {page + 1} / {totalPages}
          </Typography>

          {/* Botón: Siguiente */}
          <IconButton
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            size='small'
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <KeyboardArrowRight />
          </IconButton>

          {/* Botón: Ir al final */}
          <IconButton
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            size='small'
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            <LastPage />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}