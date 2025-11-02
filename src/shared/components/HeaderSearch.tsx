import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { formatPrice } from '@/helpers';

interface HeaderSearchProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  variants: Array<{ price: number }>;
}

export const HeaderSearch = ({ anchorEl, open, onClose }: HeaderSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, images, variants(price)')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(10);

        if (error) throw error;
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error buscando productos:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  const handleProductClick = (slug: string) => {
    navigate(`/tienda/${slug}`);
    onClose();
    setSearchQuery('');
  };

  const handleViewShop = () => {
    navigate('/tienda');
    onClose();
    setSearchQuery('');
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: { xs: '90vw', sm: 400 },
          maxHeight: 500,
          mt: 1,
        },
      }}
    >
      <Paper elevation={0}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder='Buscar productos...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon color='action' />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleClear} edge='end'>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : !debouncedQuery || debouncedQuery.length < 2 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Escribe al menos 2 caracteres para buscar
              </Typography>
            </Box>
          ) : products.length > 0 ? (
            <>
              <List>
                {products.map((product) => {
                  const price = product.variants?.[0]?.price || 0;
                  const productImage = product.images?.[0] || '/assets/images/img-default.png';
                  
                  return (
                    <ListItem
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={productImage}
                          alt={product.name}
                          variant='rounded'
                          sx={{ width: 56, height: 56, mr: 1 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={formatPrice(price)}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'primary',
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Divider />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  color='primary'
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={handleViewShop}
                >
                  Ver todos los productos
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                No se encontraron productos con "{debouncedQuery}"
              </Typography>
              <Typography
                variant='caption'
                color='primary'
                sx={{
                  cursor: 'pointer',
                  display: 'block',
                  mt: 1,
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={handleViewShop}
              >
                Ver todos los productos en la tienda
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Popover>
  );
};
