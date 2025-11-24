import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import StorageIcon from '@mui/icons-material/Storage';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DeleteProductModalProps {
  open: boolean;
  productName: string;
  variantsCount: number;
  imagesCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteProductModal = ({
  open,
  productName,
  variantsCount,
  imagesCount,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteProductModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
          borderBottom: '1px solid #e5e7eb',
          mb: 1,
        }}
      >
        <WarningAmberIcon sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
        <Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>
          Eliminar Producto
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 2.5 }}>
        {/* Alerta */}
        <Alert
          severity="error"
          icon={<DeleteOutlineIcon />}
          sx={{ mb: 2.5, backgroundColor: '#fef2f2', color: '#991b1b' }}
        >
          Esta acción es <strong>irreversible</strong>. Se eliminarán todos los datos asociados.
        </Alert>

        {/* Producto */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
            Producto:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {productName}
          </Typography>
        </Box>

        {/* Lo que se eliminará */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
            Se eliminará:
          </Typography>
          <List sx={{ p: 0 }}>
            {/* Variantes */}
            <ListItem sx={{ px: 0, py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <StorageIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${variantsCount} ${variantsCount === 1 ? 'variante' : 'variantes'}`}
                secondary="Todas las variantes del producto"
                primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                secondaryTypographyProps={{ variant: 'caption', sx: { color: '#9ca3af' } }}
              />
            </ListItem>

            {/* Imágenes */}
            <ListItem sx={{ px: 0, py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ImageIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${imagesCount} ${imagesCount === 1 ? 'imagen' : 'imágenes'}`}
                secondary="Del almacenamiento en la nube"
                primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                secondaryTypographyProps={{ variant: 'caption', sx: { color: '#9ca3af' } }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Confirmación */}
        <Box sx={{ p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Por favor, asegúrate de que deseas continuar. Este cambio no se puede deshacer.
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          sx={{
            backgroundColor: '#ef4444',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#dc2626',
            },
            '&:disabled': {
              backgroundColor: '#fecaca',
            },
          }}
        >
          {isLoading ? 'Eliminando...' : 'Eliminar Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};