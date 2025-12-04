import { Box, Chip, Tooltip, Typography, Zoom } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const LOW_STOCK_THRESHOLD = 5;

interface Props {
  currentStock: number;
  allVariants: any[]; 
  currentVariantId: string;
}

export const ProductStockStatus = ({ currentStock, allVariants, currentVariantId }: Props) => {
  
  const otherVariants = allVariants?.filter(v => v.id !== currentVariantId) || [];
  
  const criticalVariants = otherVariants.filter(v => v.stock === 0);
  const lowStockVariants = otherVariants.filter(v => v.stock > 0 && v.stock <= LOW_STOCK_THRESHOLD);
  
  const hasHiddenIssues = criticalVariants.length > 0 || lowStockVariants.length > 0;

  const renderCurrentStockBadge = () => {
    if (currentStock === 0) {
      return (
        <Chip 
          label="Agotado" 
          size="small" 
          color="error" 
          variant="filled" 
          sx={{ height: 24, fontWeight: 'bold', minWidth: 70 }} 
        />
      );
    }
    if (currentStock <= LOW_STOCK_THRESHOLD) {
      return (
        <Tooltip title="Stock crítico en esta variante">
             <Chip 
               label={`${currentStock} Bajo`} 
               size="small" 
               color="warning" 
               variant="outlined" 
               sx={{ 
                 height: 24, 
                 fontWeight: 'bold', 
                 borderColor: '#ed6c02', 
                 color: '#ed6c02',
                 bgcolor: 'rgba(237, 108, 2, 0.05)'
               }} 
             />
        </Tooltip>
      );
    }
    return <Typography variant="body2" fontWeight={600}>{currentStock}</Typography>;
  };

  const getVariantLabel = (v: any) => {
    const label = [v.color_name, v.storage, v.finish, v.size]
      .filter(Boolean)
      .join(' • ');
    return label || 'Variante sin nombre';
  };

  const tooltipContent = (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 1, borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 0.5 }}>
        Otras variantes con problemas
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {criticalVariants.map(v => (
            <Box key={v.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, color: '#ff8a80' }}>
              <span style={{ whiteSpace: 'nowrap' }}>• {getVariantLabel(v)}:</span> 
              <strong>AGOTADO</strong>
            </Box>
          ))}
          
          {lowStockVariants.map(v => (
            <Box key={v.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, color: '#ffcc80' }}>
              <span style={{ whiteSpace: 'nowrap' }}>• {getVariantLabel(v)}:</span> 
              <strong>con {v.stock} unidades</strong>
            </Box>
          ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {renderCurrentStockBadge()}

      {hasHiddenIssues && (
        <Tooltip title={tooltipContent} arrow TransitionComponent={Zoom} placement="top">
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help', opacity: 0.8, '&:hover': { opacity: 1 } }}>
            {criticalVariants.length > 0 ? (
              <ErrorOutlineRoundedIcon fontSize="small" color="error" />
            ) : (
              <WarningAmberRoundedIcon fontSize="small" color="warning" />
            )}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};