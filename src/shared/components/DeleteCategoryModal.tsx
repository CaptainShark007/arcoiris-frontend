import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ImageIcon from '@mui/icons-material/Image';

interface DeleteCategoryModalProps {
  open: boolean;
  categoryName: string;
  hasImage: boolean;
  productsCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteCategoryModal = ({
  open,
  categoryName,
  hasImage,
  productsCount,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteCategoryModalProps) => {
  const canDelete = productsCount === 0;

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
          Eliminar Categoría
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 2.5 }}>
        {!canDelete && (
          <Alert
            severity="error"
            icon={<DeleteOutlineIcon />}
            sx={{ mb: 2.5, backgroundColor: '#fef2f2', color: '#991b1b' }}
          >
            No se puede eliminar. Esta categoría tiene <strong>{productsCount}</strong>{' '}
            {productsCount === 1 ? 'producto' : 'productos'} asociados.
          </Alert>
        )}

        {canDelete && (
          <>
            <Alert
              severity="error"
              icon={<DeleteOutlineIcon />}
              sx={{ mb: 2.5, backgroundColor: '#fef2f2', color: '#991b1b' }}
            >
              Esta acción es <strong>irreversible</strong>. Se eliminarán todos los datos asociados.
            </Alert>

            {/* Categoría */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                Categoría:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {categoryName}
              </Typography>
            </Box>

            {/* Lo que se eliminará */}
            {hasImage && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                  Se eliminará:
                </Typography>
                <Box sx={{ p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      La imagen de la categoría
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 0.5 }}>
                    Del almacenamiento en la nube
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Confirmación */}
            <Box sx={{ p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Por favor, asegúrate de que deseas continuar. Este cambio no se puede deshacer.
              </Typography>
            </Box>
          </>
        )}
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
        {canDelete && (
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
            {isLoading ? 'Eliminando...' : 'Eliminar Categoría'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};