import { useState, useEffect, MutableRefObject } from 'react';
import { 
  Box, Typography, Button, TextField, Stack, 
  Radio, Card, CardActionArea, Collapse 
} from '@mui/material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import toast from 'react-hot-toast';

interface ShippingStepProps {
  onNext: () => void;
  onBack: () => void;
  onValidateAndSaveRef?: MutableRefObject<(() => boolean) | null>;
}

export const ShippingStep = ({ onNext, onBack, onValidateAndSaveRef }: ShippingStepProps) => {

  const [form, setForm] = useState({
    addressLine1: '',
    city: '',
    postalCode: '',
    name: '',
    email: '',
    phone: '',
  });

  const [selected, setSelected] = useState<'retiro' | 'acordar' | null>(null);

  const handleSelect = (option: 'retiro' | 'acordar') => {
    setSelected(option);
  };

  const setShippingInfo = useCheckoutStore((state) => state.setShippingInfo);

  const validateAndSave = (): boolean => {
    // Si seleccionó retiro, guardar información básica
    if (selected === 'retiro') {
      setShippingInfo({
        addressLine1: 'Retiro en sucursal',
        city: 'Resistencia',
        state: 'Chaco',
        postalCode: '3500',
        country: 'Argentina',
        name: 'Retiro en sucursal',
        email: '',
        phone: '',
      });
      return true;
    }

    // Si seleccionó acordar, validar que el formulario esté completo
    if (selected === 'acordar') {
      const { addressLine1, city, name, email, phone } = form;
      
      if (!addressLine1 || !city || !name || !email || !phone) {
        toast.error('Por favor, completa todos los campos obligatorios.', {
          position: 'bottom-right',
        });
        return false;
      }

      setShippingInfo({
        ...form,
        state: 'Chaco',
        country: 'Argentina',
      });
      return true;
    }

    // No seleccionó ninguna opción
    toast.error('Por favor, selecciona un método de envío.', {
      position: 'bottom-right',
    });
    return false;
  };

  const handleNext = () => {
    if (validateAndSave()) {
      onNext();
    }
  };

  // Exponer la función de validación al componente padre
  useEffect(() => {
    if (onValidateAndSaveRef) {
      onValidateAndSaveRef.current = validateAndSave;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, form]);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      {/* Opción 1 - Retiro en sucursal */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderColor: selected === 'retiro' ? 'primary.main' : 'divider',
          boxShadow: selected === 'retiro' ? 4 : 0,
          borderWidth: 2,
          transition: '0.2s',
          borderRadius: 1,
        }}
      >
        <CardActionArea onClick={() => handleSelect('retiro')}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
            sx={{ p: 3 }}
          >
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Radio
                checked={selected === 'retiro'}
                color="primary"
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Retiro en sucursal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comunicate con nosotros para coordinar el retiro por sucursal, simplemente contactanos a través
                  del icono de WhatsApp con su número de orden.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" fontWeight="bold" color='primary' >
              Gratis
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>

      {/* Opción 2 - Envío a acordar */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderColor: selected === 'acordar' ? 'primary.main' : 'divider',
          boxShadow: selected === 'acordar' ? 4 : 0,
          borderWidth: 2,
          transition: '0.2s',
          borderRadius: 1,
        }}
      >
        <CardActionArea onClick={() => handleSelect('acordar')}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
            sx={{ p: 3 }}
          >
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Radio
                checked={selected === 'acordar'}
                color="primary"
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Envío a acordar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Con nuestro método de envío a acordar, puedes comunicarte directamente con nuestro equipo de atención al cliente
                  para discutir las opciones de entrega que mejor se adapten a tus necesidades. Para coordinar el envío a tu medida,
                  simplemente contáctanos a través del icono de WhatsApp con tu número de orden.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>

      {/* Formulario condicional */}
      <Collapse in={selected === 'acordar'}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información de entrega
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <TextField 
              label="Dirección" 
              fullWidth 
              required 
              value={form.addressLine1}
              onChange={(e) => updateForm('addressLine1', e.target.value)}
            />
            <TextField 
              label="Ciudad" 
              fullWidth 
              required 
              value={form.city}
              onChange={(e) => updateForm('city', e.target.value)}
            />
            <TextField 
              label="Código postal" 
              fullWidth 
              value={form.postalCode}
              onChange={(e) => updateForm('postalCode', e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información de contacto
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <TextField 
              label="Nombre" 
              fullWidth 
              required 
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
            <TextField 
              label="Correo electrónico" 
              fullWidth 
              required 
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
            />
            <TextField 
              label="Teléfono" 
              fullWidth 
              required 
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
            />
          </Box>
        </Box>
      </Collapse>

      {/* Botones móviles */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onBack} fullWidth>
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          fullWidth
          disabled={!selected}
        >
          Continuar con pago
        </Button>
      </Box>
    </Box>
  );
};