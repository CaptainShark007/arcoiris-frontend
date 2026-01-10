import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment,
  Pagination,
  Card
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

import { usePartners } from '../hooks/partner/usePartners';
import { PartnersTable } from '../components/partner/PartnersTable';
import { CreatePartnerModal } from '../components/partner/CreatePartnerModal';
import { SeoHead } from '@shared/components';

const ITEMS_PER_PAGE = 10;

const DashboardPartnersPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { partners, count, isLoading } = usePartners({
    page,
    limit: ITEMS_PER_PAGE,
    searchTerm,
    status: 'all'
  });

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}> 
      <SeoHead title="Socios" description="Gestión de socios y referidos" />

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 4 
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }} 
          >
            Socios & Referidos
          </Typography>
          <Typography color="text.secondary" mt={1} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Gestiona los códigos de socios comerciales.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ 
            bgcolor: 'black', 
            '&:hover': { bgcolor: '#333' },
            width: { xs: '100%', sm: 'auto' } 
          }} 
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
          sx={{ 
            width: { xs: '100%', sm: 300 },
            bgcolor: 'white' 
          }}
        />
      </Box>

      <Card 
        sx={{ 
          p: { xs: 0, sm: 0 },
          bgcolor: '#F9FAFB', 
          boxShadow: 'none', 
          border: { xs: 'none', md: '1px solid #E5E7EB' },
          overflow: 'hidden',
          background: { xs: 'transparent', md: '#F9FAFB' }
        }}
      >
        <PartnersTable partners={partners} isLoading={isLoading} />
      </Card>

      {/* Paginación */}
      {!isLoading && count > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)} 
            color="primary"
            size="medium"
            siblingCount={0} 
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