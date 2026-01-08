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
import { SeoHead } from '@shared/components'; // Asumo que usas esto

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
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}> {/* Padding responsivo */}
      <SeoHead title="Socios" description="Gestión de socios y referidos" />

      {/* Header Responsivo */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil, Fila en desktop
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
            sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }} // Texto más pequeño en móvil
          >
            Socios & Referidos
          </Typography>
          <Typography color="text.secondary" mt={1} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Gestiona los códigos de influencers y socios comerciales.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ 
            bgcolor: 'black', 
            '&:hover': { bgcolor: '#333' },
            width: { xs: '100%', sm: 'auto' } // Botón ancho completo en móvil
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
            width: { xs: '100%', sm: 300 }, // Input ancho completo en móvil
            bgcolor: 'white' 
          }}
        />
      </Box>

      {/* Tabla (Contenida en Card para consistencia visual) */}
      <Card 
        sx={{ 
          p: { xs: 0, sm: 0 }, // Sin padding interno para que la tabla llegue a los bordes
          bgcolor: '#F9FAFB', 
          boxShadow: 'none', 
          border: { xs: 'none', md: '1px solid #E5E7EB' }, // Sin borde en móvil para que se vea limpio
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
            size="medium" // 'small' si quieres ahorrar más espacio
            siblingCount={0} // Muestra menos números en móvil para que no se rompa
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