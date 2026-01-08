import React from 'react';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment,
  Pagination 
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

import { usePartners } from '../hooks/partner/usePartners';
import { PartnersTable } from '../components/partner/PartnersTable';
import { CreatePartnerModal } from '../components/partner/CreatePartnerModal';

const ITEMS_PER_PAGE = 10;

const DashboardPartnersPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook de listado con filtros
  const { partners, count, isLoading } = usePartners({
    page,
    limit: ITEMS_PER_PAGE,
    searchTerm,
    status: 'all'
  });

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Resetear a página 1 cuando se busca
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Socios & Referidos
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Gestiona los códigos de influencers y socios comerciales.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }} // Estilo tipo tu botón anterior
        >
          Nuevo Socio
        </Button>
      </Box>

      {/* Filtros */}
      <Box mb={3}>
        <TextField
          placeholder="Buscar por nombre o código..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, bgcolor: 'white' }}
        />
      </Box>

      {/* Tabla */}
      <PartnersTable partners={partners} isLoading={isLoading} />

      {/* Paginación */}
      {!isLoading && count > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)} 
            color="primary"
          />
        </Box>
      )}

      {/* Modal */}
      <CreatePartnerModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Box>
  );
};

export default DashboardPartnersPage;