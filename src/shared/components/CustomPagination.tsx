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
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => onPageChange(0)}
            disabled={page === 0}
            size='small'
          >
            <FirstPage />
          </IconButton>

          <IconButton
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            size='small'
          >
            <KeyboardArrowLeft />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                    variant={pageNumber === page + 1 ? 'contained' : 'text'}
                    onClick={() => onPageChange((pageNumber as number) - 1)}
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
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            size='small'
          >
            <KeyboardArrowRight />
          </IconButton>

          <IconButton
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            size='small'
          >
            <LastPage />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
