import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminClient } from '@shared/types/admin-client';

interface AdminClientTableProps {
  clients: AdminClient[];
  onEdit: (client: AdminClient) => void;
  onDelete: (client: AdminClient) => void;
}

export const AdminClientTable = ({ clients, onEdit, onDelete }: AdminClientTableProps) => {
  if (clients.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          gap: 1,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No se encontraron clientes
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Creá un nuevo cliente o ajustá la búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Teléfono</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }} align="center">
              Estado
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }} align="right">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              sx={{
                '&:hover': { backgroundColor: '#f9fafb' },
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {client.full_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {client.phone}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {client.email || '—'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={client.is_active ? 'Activo' : 'Inactivo'}
                  size="small"
                  color={client.is_active ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Editar" arrow>
                  <IconButton size="small" onClick={() => onEdit(client)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar" arrow>
                  <IconButton size="small" onClick={() => onDelete(client)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
