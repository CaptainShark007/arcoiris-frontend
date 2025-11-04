import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface CartSearchProps {
  onSearchChange: (query: string) => void;
}

export const CartSearch: React.FC<CartSearchProps> = ({ onSearchChange }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query, onSearchChange]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Buscar producto en el carrito..."
      variant="outlined"
      fullWidth
      size="small"
      sx={{ mb: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
