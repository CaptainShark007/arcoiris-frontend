import { Box, Typography, Button, Radio, Stack, Card, CardActionArea } from '@mui/material';
import { RadioButtonChecked } from '@mui/icons-material';
import { useState } from 'react';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  onEditAddress?: () => void;
}

export const PaymentStep = ({ onNext, onBack, onEditAddress }: PaymentStepProps) => {
  const [selected, setSelected] = useState<'acordar'>('acordar');

  return (
    <Box>
      {/* Sección de entrega y facturación */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1,
          bgcolor: 'info.light',
          //boxShadow: 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            Entrega y facturación
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onEditAddress}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 2,
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
              },
            }}
          >
            Editar
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Roque Sáenz Peña, Resistencia, Chaco 3500, Argentina
        </Typography>
      </Box>

      {/* Sección de método de pago */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Método de pago
      </Typography>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: selected === 'acordar' ? 'primary.main' : 'divider',
          boxShadow: selected === 'acordar' ? 4 : 0,
          borderWidth: 2,
          transition: '0.2s',
          borderRadius: 2,
        }}
      >
        <CardActionArea onClick={() => setSelected('acordar')}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
            <Radio
              checked={selected === 'acordar'}
              color="primary"
              icon={<RadioButtonChecked sx={{ opacity: 0.4 }} />}
              checkedIcon={<RadioButtonChecked color="primary" />}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Acordar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coordinaremos el método de pago y la entrega directamente contigo.
              </Typography>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>

      {/* Botones inferiores */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onBack} fullWidth>
          Volver
        </Button>
        <Button variant="contained" onClick={onNext} fullWidth>
          Confirmar orden
        </Button>
      </Box>
    </Box>
  );
};
