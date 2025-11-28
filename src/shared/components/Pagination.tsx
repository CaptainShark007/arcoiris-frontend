import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({ totalItems, page, setPage }: Props) => {
  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const itemsPerPage = 10;
  const totalPages = totalItems
    ? Math.ceil(totalItems / itemsPerPage)
    : 1;
  const isLastPage = page >= totalPages;

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Mostrando{' '}
        <span style={{ fontWeight: 'bold' }}>
          {startItem} - {endItem}
        </span>{' '}
        de <span style={{ fontWeight: 'bold' }}>{totalItems}</span> productos
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Anterior
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={handleNextPage}
          disabled={isLastPage}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};