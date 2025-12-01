import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { formatPrice } from '@/helpers';
import { HeaderSearchProps, ProductSearch } from '@shared/types';
import { useHeaderSearch } from '@shared/hooks';

export const HeaderSearch = ({ anchorEl, open, onClose }: HeaderSearchProps) => {

  const {
    searchQuery,
    debouncedQuery,
    products,
    isLoading,
    handleSearchChange,
    handleClear,
    handleProductClick,
    handleViewShop,
  } = useHeaderSearch(onClose);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableScrollLock
      PaperProps={{
        sx: { width: { xs: '90vw', sm: 400 }, maxHeight: 500, mt: 1 },
      }}
    >
      <Paper elevation={0}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder='Buscar productos...'
            value={searchQuery}
            onChange={handleSearchChange}
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SearchResultsList 
              query={debouncedQuery}
              products={products}
              onProductClick={handleProductClick}
              onViewShop={handleViewShop}
            />
          )}
        </Box>
      </Paper>
    </Popover>
  );
};

// Se encarga exclusivamente de decidir qué mostrar según los datos
interface SearchResultsListProps {
  query: string;
  products: ProductSearch[];
  onProductClick: (slug: string) => void;
  onViewShop: () => void;
}

const SearchResultsList = ({ query, products, onProductClick, onViewShop }: SearchResultsListProps) => {
  // Caso 1: El usuario aún no escribe suficiente
  if (!query || query.length < 2) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          Escribe al menos 2 caracteres para buscar
        </Typography>
      </Box>
    );
  }

  // Caso 2: Escribió, pero no hay coincidencias
  if (products.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          No se encontraron productos con {query}
        </Typography>
        <Typography
          variant='caption'
          color='primary'
          sx={{
            cursor: 'pointer',
            display: 'block',
            mt: 1,
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={onViewShop}
        >
          Ver todos los productos en la tienda
        </Typography>
      </Box>
    );
  }

  // Caso 3: Hay resultados
  return (
    <>
      <List disablePadding>
        {products.map((product) => {
          // Lógica de presentación segura (evita errores si falta info)
          const price = product.variants?.[0]?.price || 0;
          const productImage = product.images?.[0] || '/assets/images/img-default.png';

          return (
            <ListItem
              key={product.id}
              onClick={() => onProductClick(product.slug)}
              sx={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={productImage}
                  alt={product.name}
                  variant='rounded'
                  sx={{ width: 48, height: 48, mr: 1 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={formatPrice(price)}
                primaryTypographyProps={{ 
                    variant: 'body2', 
                    fontWeight: 500,
                    sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } 
                }}
                secondaryTypographyProps={{ variant: 'caption', color: 'primary.main', fontWeight: 700 }}
              />
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      {/* Botón final para ver todo */}
      <Box 
        sx={{ 
          p: 1.5, 
          textAlign: 'center', 
          bgcolor: 'grey.50',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'grey.100' }
        }}
        onClick={onViewShop}
      >
        <Typography
          variant='body2'
          color='primary'
          sx={{ fontWeight: 600 }}
        >
          Ver todos los resultados
        </Typography>
      </Box>
    </>
  );
};