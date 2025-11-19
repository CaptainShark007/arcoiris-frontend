import { useState, useEffect, MutableRefObject } from 'react';
import { 
  Box, Typography, Button, TextField, Stack, 
  Radio, Card, CardActionArea, Collapse 
} from '@mui/material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { shippingSchema } from '../schemas/shoppingSchema';

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<'retiro' | 'acordar' | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSelect = (option: 'retiro' | 'acordar') => {
    setSelected(option);
    setErrors({});
  };

  const { setShippingInfo, setShippingMethod } = useCheckoutStore();

  const validateAndSave = (): boolean => {
    // Si seleccionó retiro, guardar información básica
    if (selected === 'retiro') {
      setShippingInfo({
        addressLine1: 'Retiro en sucursal',
        city: 'Resistencia',
        state: 'Chaco',
        postalCode: '3500',
        country: 'Argentina',
        name: '',
        email: '',
        phone: '',
      });
      setShippingMethod('retiro'); // Guardar el método seleccionado
      return true;
    }

    // Si seleccionó acordar, validar con Yup (síncrono)
    if (selected === 'acordar') {
      try {
        shippingSchema.validateSync(form, { abortEarly: false });
        setErrors({});
        
        setShippingInfo({
          ...form,
          state: 'Chaco',
          country: 'Argentina',
        });
        setShippingMethod('acordar'); // Guardar el método seleccionado
        return true;
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const newErrors: Record<string, string> = {};
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          setErrors(newErrors);
          
          // Marcar todos los campos como touched
          const allTouched = Object.keys(form).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>);
          setTouched(allTouched);
        }
        return false;
      }
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
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
              onBlur={() => handleBlur('addressLine1')}
              error={touched.addressLine1 && !!errors.addressLine1}
              helperText={touched.addressLine1 && errors.addressLine1}
            />
            <TextField 
              label="Ciudad" 
              fullWidth 
              required 
              value={form.city}
              onChange={(e) => updateForm('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              error={touched.city && !!errors.city}
              helperText={touched.city && errors.city}
            />
            <TextField 
              label="Código postal" 
              fullWidth 
              value={form.postalCode}
              onChange={(e) => updateForm('postalCode', e.target.value)}
              onBlur={() => handleBlur('postalCode')}
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
              onBlur={() => handleBlur('name')}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
            />
            <TextField 
              label="Correo electrónico" 
              fullWidth 
              required 
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <TextField 
              label="Teléfono" 
              fullWidth 
              required 
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
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