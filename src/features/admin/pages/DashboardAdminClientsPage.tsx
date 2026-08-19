import { useState } from 'react';
import { Box, Typography, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Loader, SeoHead } from '@shared/components';
import { useAdminClients, useCreateAdminClient, useUpdateAdminClient, useDeleteAdminClient } from '../hooks';
import { AdminClientTable } from '../components/admin-client/AdminClientTable';
import { AdminClientFormDialog } from '../components/admin-client/AdminClientFormDialog';
import { AdminClientSearch } from '../components/admin-client/AdminClientSearch';
import { AdminClientFormData } from '../schema/adminClientSchema';
import { AdminClient } from '@shared/types/admin-client';

const DashboardAdminClientsPage = () => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null);
  const [deletingClient, setDeletingClient] = useState<AdminClient | null>(null);

  const { data: clients = [], isLoading } = useAdminClients(search);
  const createMutation = useCreateAdminClient();
  const updateMutation = useUpdateAdminClient();
  const deleteMutation = useDeleteAdminClient();

  const handleCreate = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleEdit = (client: AdminClient) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleDelete = (client: AdminClient) => {
    setDeletingClient(client);
  };

  const handleConfirmDelete = () => {
    if (deletingClient) {
      deleteMutation.mutate(deletingClient.id, {
        onSuccess: () => setDeletingClient(null),
      });
    }
  };

  const handleSave = (data: AdminClientFormData) => {
    if (editingClient) {
      updateMutation.mutate(
        { id: editingClient.id, input: data },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SeoHead
        title="Clientes Admin"
        description="Gestión de clientes administrativos para el POS"
      />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Clientes
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Clientes administrativos para ventas por POS
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ textTransform: 'none' }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Búsqueda */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <AdminClientSearch value={search} onChange={setSearch} />
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          {clients.length} cliente{clients.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Tabla */}
      <Card
        sx={{
          boxShadow: 'none',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <AdminClientTable clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
      </Card>

      {/* Dialog de crear/editar */}
      <AdminClientFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        client={editingClient}
        loading={isSaving}
      />

      {/* Dialog de confirmar eliminación */}
      <Dialog open={!!deletingClient} onClose={() => setDeletingClient(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar Cliente</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar a <strong>{deletingClient?.full_name}</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingClient(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardAdminClientsPage;
