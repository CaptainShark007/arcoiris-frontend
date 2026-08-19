import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  ListItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  getAdminClients,
  searchAdminClientsForPos,
} from '@/actions/admin-clients';
import { AdminClient } from '@shared/types/admin-client';
import { AdminClientFormDialog } from '@features/admin/components/admin-client/AdminClientFormDialog';
import { AdminClientFormData } from '@features/admin/schema/adminClientSchema';
import { useCreateAdminClient } from '@features/admin/hooks/admin-client/useCreateAdminClient';
import { useUpdateAdminClient } from '@features/admin/hooks/admin-client/useUpdateAdminClient';
import { useDeleteAdminClient } from '@features/admin/hooks/admin-client/useDeleteAdminClient';

interface AdminClientSelectorProps {
  selectedClient: AdminClient | null;
  onSelect: (client: AdminClient | null) => void;
}

export const AdminClientSelector = ({
  selectedClient,
  onSelect,
}: AdminClientSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<AdminClient[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Formulario (crear / editar)
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null);

  // Confirmación de eliminación
  const [deleteTarget, setDeleteTarget] = useState<AdminClient | null>(null);

  const createClient = useCreateAdminClient();
  const updateClient = useUpdateAdminClient();
  const deleteClient = useDeleteAdminClient();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadRecent = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getAdminClients('', true, 100);
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const runSearch = useCallback(
    async (value: string) => {
      if (value.trim().length < 2) {
        await loadRecent();
        return;
      }
      setLoadingList(true);
      try {
        const data = await searchAdminClientsForPos(value);
        setList(data);
      } catch {
        setList([]);
      } finally {
        setLoadingList(false);
      }
    },
    [loadRecent]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(value);
    }, 300);
  };

  useEffect(() => {
    if (open) {
      setSearch('');
      loadRecent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSelect = (client: AdminClient | null) => {
    onSelect(client);
    setOpen(false);
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (client: AdminClient) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleSaveForm = async (data: AdminClientFormData) => {
    if (editingClient) {
      const updated = await updateClient.mutateAsync({
        id: editingClient.id,
        input: {
          full_name: data.full_name,
          phone: data.phone,
          email: data.email,
          is_active: data.is_active,
        },
      });
      setList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (selectedClient?.id === updated.id) onSelect(updated);
      setFormOpen(false);
    } else {
      const created = await createClient.mutateAsync({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        is_active: data.is_active,
      });
      setList((prev) => [created, ...prev].slice(0, 5));
      onSelect(created);
      setFormOpen(false);
      setOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    await deleteClient.mutateAsync(target.id);
    setList((prev) => prev.filter((c) => c.id !== target.id));
    if (selectedClient?.id === target.id) onSelect(null);
    setDeleteTarget(null);
  };

  const formLoading = createClient.isPending || updateClient.isPending;

  return (
    <>
      {/* Disparador */}
      <Button
        fullWidth
        variant='outlined'
        onClick={() => setOpen(true)}
        startIcon={
          <PersonIcon sx={{ color: selectedClient ? '#2563eb' : '#9ca3af' }} />
        }
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          py: 1,
          fontSize: '0.85rem',
          fontWeight: 600,
          color: selectedClient ? '#1e3a8a' : '#6b7280',
          borderColor: selectedClient ? '#bfdbfe' : 'grey.400',
          bgcolor: selectedClient ? '#eff6ff' : 'white',
          '&:hover': {
            borderColor: '#bfdbfe',
            bgcolor: selectedClient ? '#eff6ff' : 'grey.50',
          },
        }}
      >
        {selectedClient ? selectedClient.full_name : 'Cliente anónimo'}
      </Button>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          sx: {
            //minHeight: 520,
            minWidth: 480,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogContent sx={{ pb: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant='contained'
                startIcon={<PersonAddIcon />}
                onClick={handleOpenCreate}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                crear
              </Button>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                Elige un cliente
              </Typography>
            </Box>
            <TextField
              size='small'
              autoFocus
              placeholder='Buscar...'
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: '#9ca3af', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 240 },
                '& .MuiOutlinedInput-root': { fontSize: '0.85rem' },
              }}
            />
          </Box>

          <ListItemButton
            selected={!selectedClient}
            onClick={() => handleSelect(null)}
            sx={{
              py: 1,
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <PersonIcon
              sx={{
                mr: 1.5,
                color: !selectedClient ? '#2563eb' : '#9ca3af',
                fontSize: '1.2rem',
              }}
            />
            <ListItemText
              primary={
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Cliente anónimo
                </Typography>
              }
              secondary={
                <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                  Sin cliente asignado
                </Typography>
              }
            />
          </ListItemButton>

          <Paper
            variant='outlined'
            sx={{
              height: 56 * 5,
              overflowY: 'auto',
              bgcolor: 'grey.50',
            }}
          >
            <List dense disablePadding>
              {loadingList && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}

              {!loadingList &&
                list.map((client) => {
                  const isSelected = selectedClient?.id === client.id;
                  return (
                    <ListItem
                      key={client.id}
                      disablePadding
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(client);
                            }}
                          >
                            <EditIcon
                              sx={{ fontSize: '1.1rem', color: '#6b7280' }}
                            />
                          </IconButton>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(client);
                            }}
                          >
                            <DeleteIcon
                              sx={{ fontSize: '1.1rem', color: '#ef4444' }}
                            />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => handleSelect(client)}
                        sx={{ py: 1 }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                            >
                              {client.full_name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{ fontSize: '0.72rem', color: '#6b7280' }}
                            >
                              {client.phone}
                              {client.email && ` · ${client.email}`}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}

              {!loadingList && list.length === 0 && (
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  No se encontraron clientes
                </Typography>
              )}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant='outlined'
            color='inherit'
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Descartar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario crear / editar */}
      <AdminClientFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveForm}
        client={editingClient}
        loading={formLoading}
      />

      {/* Confirmar eliminación */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar cliente</DialogTitle>
        <DialogContent>
          <Typography variant='body2'>
            ¿Estás seguro de que querés eliminar a{' '}
            <Box component='span' fontWeight={700}>
              {deleteTarget?.full_name}
            </Box>
            ? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteClient.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleConfirmDelete}
            disabled={deleteClient.isPending}
          >
            {deleteClient.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

