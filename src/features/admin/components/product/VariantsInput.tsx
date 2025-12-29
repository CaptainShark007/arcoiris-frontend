import React, { useEffect, useState } from 'react';
import {
  FieldErrors,
  Control,
  useFieldArray,
  UseFormRegister,
  useWatch,
  UseFormSetValue,
} from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Popover,
  TextField,
  useMediaQuery,
  useTheme,
  Alert,
  FormControlLabel,
  Checkbox,
  Collapse,
  Stack,
  InputAdornment,
  Chip,
} from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';
//import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

interface VariantsProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

const headersVariants = [
  'Stock*',
  'Precio*',
  'Presentación',
  'Color',
  'Terminación',
  '',
];

// Función auxiliar para calcular porcentaje en tiempo real
const getDiscountLabel = (price: number, originalPrice: number) => {
  if (!originalPrice || originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${discount}% OFF`;
};

export const VariantsInput = ({
  control,
  errors,
  register,
  setValue,
}: VariantsProps) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'variants',
  });

  const [colorActive, setColorActive] = useState<(HTMLElement | null)[]>([]);

  // Estado local para manejar visualmente qué filas tienen el toggle de oferta activado
  const [offersActive, setOffersActive] = useState<{ [key: string]: boolean }>(
    {}
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Observamos los valores para calcular descuentos en tiempo real
  const watchedVariants = useWatch({
    control,
    name: 'variants',
  });

  // Inicializar el estado de los toggles basado en si ya existe un original_price (edición)
  useEffect(() => {
    const initialOffers: { [key: string]: boolean } = {};
    fields.forEach((field, index) => {
      // Si viene data del backend y original_price es mayor al precio, activamos el toggle
      const currentVariant = watchedVariants?.[index];
      if (
        currentVariant?.originalPrice &&
        currentVariant.originalPrice > (currentVariant.price || 0)
      ) {
        initialOffers[field.id] = true;
      }
    });
    // Solo actualizamos si el objeto no está vacío para evitar rerenders infinitos
    if (Object.keys(initialOffers).length > 0) {
      setOffersActive((prev) => ({ ...prev, ...initialOffers }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo al montar o cuando cambien los fields base

  const addVariant = () => {
    append({
      stock: 0,
      price: 0,
      originalPrice: 0,
      storage: '',
      finish: '',
      color: '',
      colorName: '',
    });
  };

  const removeVariant = (index: number) => {
    remove(index);
  };

  const toggleOffer = (
    index: number,
    fieldId: string,
    currentChecked: boolean
  ) => {
    setOffersActive((prev) => ({ ...prev, [fieldId]: currentChecked }));

    // Si desactiva la oferta, limpiamos el valor del original_price para evitar inconsistencias
    if (!currentChecked) {
      setValue(`variants.${index}.originalPrice`, null);
    }
  };

  const handleColorOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const newActive = [...colorActive];
    newActive[index] = event.currentTarget;
    setColorActive(newActive);
  };

  const handleColorClose = (index: number) => {
    const newActive = [...colorActive];
    newActive[index] = null;
    setColorActive(newActive);
  };

  const colorValues = useWatch({
    control,
    name: fields.map((_, index) => `variants.${index}.color` as const),
  });

  const colorNameValues = useWatch({
    control,
    name: fields.map((_, index) => `variants.${index}.colorName` as const),
  });

  const getFirstError = (variantErrors?: FieldErrors) => {
    if (variantErrors) {
      const keys = Object.keys(variantErrors) as (keyof typeof variantErrors)[];
      if (keys.length > 0) {
        return (variantErrors as any)[keys[0]]?.message;
      }
    }
  };

  useEffect(() => {
    setColorActive(fields.map(() => null));
  }, [fields]);

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 2 },
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Feedback informativo */}
        <Alert
          severity='info'
          sx={{
            mb: 1.5,
            py: 0,
            backgroundColor: '#eff6ff',
            color: '#1e3a8a',
          }}
        >
          <Typography variant='caption' sx={{ fontSize: '0.75rem' }}>
            <strong>Nota:</strong> La primera variante de la lista será la que
            se muestre por defecto(en primera posición) en las tarjetas de
            producto.
          </Typography>
        </Alert>

        {fields.map((field, index) => {
          const hasOffer = offersActive[field.id] || false;
          const currentPrice = watchedVariants?.[index]?.price || 0;
          const currentOriginal = watchedVariants?.[index]?.originalPrice || 0;
          const discountLabel = getDiscountLabel(currentPrice, currentOriginal);

          return (
            <Box
              key={field.id}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 1,
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {/* Banner de descuento si aplica */}
              {hasOffer && discountLabel && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: '#d32f2f',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    px: 1,
                    py: 0.5,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  {discountLabel}
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                  Variante {index + 1}
                </Typography>
                <Button
                  onClick={() => removeVariant(index)}
                  sx={{ minWidth: 'auto', p: 0 }}
                >
                  <CancelIcon sx={{ fontSize: '1.2rem', color: '#ef4444' }} />
                </Button>
              </Box>

              {/* Fila Stock y Precio */}
              <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Stock*
                </Typography>
                <TextField
                  type='number'
                  placeholder='Stock'
                  size='small'
                  fullWidth
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Precio Final*
                </Typography>
                <TextField
                  type='number'
                  placeholder='$0.00'
                  size='small'
                  fullWidth
                  inputProps={{ step: '0.01' }}
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                />
              </Box>

              {/* Sección Oferta */}
              <Box sx={{ bgcolor: '#f9fafb', p: 1.5, borderRadius: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={hasOffer}
                      onChange={(e) =>
                        toggleOffer(index, field.id, e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography variant='caption' fontWeight={600}>
                      ¿Este producto tiene oferta?
                    </Typography>
                  }
                />
                <Collapse in={hasOffer}>
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      Precio Anterior (Tachado)
                    </Typography>
                    <TextField
                      type='number'
                      placeholder='Ej: $1500'
                      size='small'
                      fullWidth
                      color='warning'
                      inputProps={{ step: '0.01' }}
                      {...register(`variants.${index}.originalPrice`, {
                        valueAsNumber: true,
                      })}
                      helperText={
                        currentOriginal <= currentPrice
                          ? 'Debe ser mayor al precio final'
                          : `El cliente verá un ahorro de $${currentOriginal - currentPrice}`
                      }
                      FormHelperTextProps={{
                        sx: {
                          fontSize: '0.65rem',
                          color:
                            currentOriginal <= currentPrice
                              ? 'error.main'
                              : 'success.main',
                        },
                      }}
                    />
                  </Box>
                </Collapse>
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Presentación
                </Typography>
                <TextField
                  type='text'
                  placeholder='Opcional (Ej: 1 Litro)'
                  size='small'
                  fullWidth
                  {...register(`variants.${index}.storage`)}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                />
              </Box>

              {/* <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Color
                </Typography>
                <Button
                  onClick={(e) => handleColorOpen(e, index)}
                  variant='outlined'
                  size='small'
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {colorValues[index] && colorNameValues[index] ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: colorValues[index],
                        }}
                      />
                      <span>{colorNameValues[index]}</span>
                    </Box>
                  ) : (
                    'Añadir (Opcional)'
                  )}
                </Button>
                <Popover
                  open={!!colorActive[index]}
                  anchorEl={colorActive[index]}
                  onClose={() => handleColorClose(index)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <TextField
                      type='color'
                      {...register(`variants.${index}.color`)}
                      size='small'
                      sx={{ width: '170px' }}
                    />
                    <TextField
                      type='text'
                      placeholder='Opcional (Ej: Rojo)'
                      {...register(`variants.${index}.colorName`)}
                      size='small'
                      sx={{ width: '170px' }}
                    />
                  </Box>
                </Popover>
              </Box> */}

              {/* Color Picker Simplificado */}
              <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Color
                </Typography>
                <Button
                  onClick={(e) => handleColorOpen(e, index)}
                  variant='outlined'
                  size='small'
                  fullWidth
                  sx={{ justifyContent: 'flex-start', borderColor: '#e5e7eb' }}
                >
                  {watchedVariants?.[index]?.colorName || 'Seleccionar Color'}
                </Button>
                {/* Popover igual que antes */}
                <Popover
                  open={!!colorActive[index]}
                  anchorEl={colorActive[index]}
                  onClose={() => handleColorClose(index)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <TextField
                      type='color'
                      {...register(`variants.${index}.color`)}
                      size='small'
                      sx={{ width: '100%' }}
                    />
                    <TextField
                      type='text'
                      placeholder='Nombre Color'
                      {...register(`variants.${index}.colorName`)}
                      size='small'
                    />
                  </Box>
                </Popover>
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
                >
                  Terminación
                </Typography>
                <TextField
                  type='text'
                  placeholder='Opcional (Ej: Brillante)'
                  size='small'
                  fullWidth
                  {...register(`variants.${index}.finish`)}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                />
              </Box>
            </Box>
          );
        })}

        {errors.variants &&
          Array.isArray(errors.variants) &&
          errors.variants.length > 0 && (
            <Typography
              sx={{
                color: '#ef4444',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
              }}
            >
              {getFirstError(errors.variants[0])}
            </Typography>
          )}

        <Button
          type='button'
          onClick={addVariant}
          startIcon={<AddCircleIcon sx={{ color: '#25D366' }} />}
          sx={{
            alignSelf: 'center',
            textTransform: 'none',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            fontWeight: 600,
            color: '#1e293b',
            '&:hover': { backgroundColor: '#f3f4f6' },
          }}
        >
          Añadir Variante
        </Button>

        {fields.length === 0 && errors.variants && (
          <Typography
            sx={{
              color: '#ef4444',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              textAlign: 'center',
            }}
          >
            Debes añadir al menos una variante
          </Typography>
        )}
      </Box>
    );
  }

  // Desktop view
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'auto',
      }}
    >
      {/* Feedback informativo */}
      <Alert
        severity='info'
        sx={{
          mb: 1.5,
          py: 0,
          backgroundColor: '#eff6ff',
          color: '#1e3a8a',
          '& .MuiAlert-message': { padding: '8px 0', width: '100%' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant='caption'
            sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}
          >
            <strong>Nota:</strong> La primera variante de la lista será la que
            se muestre por defecto(<strong>en primera posición</strong>) en las
            tarjetas de producto.
          </Typography>
          <Typography
            variant='caption'
            sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}
          >
            <strong>Consejo:</strong> Si tu producto no tiene variaciones (es
            único), crea una sola fila para definir <strong>Precio</strong> y{' '}
            <strong>Stock</strong>. Puedes dejar <em>vacíos</em> los campos de
            Color, Presentación y Terminación.
          </Typography>
          <Typography variant='caption'>
            <strong>Tip:</strong> Activa la casilla &quot;Oferta&quot; dentro de
            la columna Precios para agregar descuentos.
          </Typography>
        </Box>
      </Alert>
      <Paper variant='outlined' sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              {headersVariants.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    p: { xs: 1, sm: 1.5 },
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => {
              const hasOffer = offersActive[field.id] || false;
              const currentPrice = watchedVariants?.[index]?.price || 0;
              const currentOriginal =
                watchedVariants?.[index]?.originalPrice || 0;
              const discountLabel = getDiscountLabel(
                currentPrice,
                currentOriginal
              );

              return (
                <TableRow key={field.id}>
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    {/* Stock */}
                    <TextField
                      type='number'
                      placeholder='Stock'
                      size='small'
                      {...register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                      sx={{ width: { xs: '70px', sm: '85px' } }}
                    />
                  </TableCell>
                  {/* <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      type='number'
                      placeholder='Precio'
                      size='small'
                      inputProps={{ step: '0.01' }}
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      sx={{ width: { xs: '80px', sm: '100px' } }}
                    />
                  </TableCell> */}
                  {/* --- COLUMNA DE PRECIOS CON TOGGLE --- */}
                  <TableCell sx={{ p: 1.5, width: '220px' }}>
                    <Stack spacing={1}>
                      <TextField
                        type='number'
                        label={hasOffer ? 'Precio Final (Oferta)' : 'Precio'}
                        placeholder='$0.00'
                        size='small'
                        fullWidth
                        color={hasOffer ? 'success' : 'primary'}
                        focused={hasOffer}
                        inputProps={{ step: '0.01' }}
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        InputProps={{
                          endAdornment: hasOffer && discountLabel && (
                            <InputAdornment position='end'>
                              <Chip
                                label={discountLabel}
                                size='small'
                                color='error'
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              size='small'
                              checked={hasOffer}
                              onChange={(e) =>
                                toggleOffer(index, field.id, e.target.checked)
                              }
                              sx={{ p: 0.5 }}
                            />
                          }
                          label={
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Aplicar oferta
                            </Typography>
                          }
                          sx={{ ml: 0, mr: 0 }}
                        />
                      </Box>

                      <Collapse in={hasOffer}>
                        <TextField
                          type='number'
                          label='Precio Anterior (Tachado)'
                          placeholder='$0.00'
                          size='small'
                          fullWidth
                          variant='filled'
                          inputProps={{ step: '0.01' }}
                          {...register(`variants.${index}.originalPrice`, {
                            valueAsNumber: true,
                          })}
                          sx={{
                            '& .MuiFilledInput-root': {
                              bgcolor: '#fff4e5',
                              '&:hover': { bgcolor: '#ffe0b2' },
                            },
                            '& input': {
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                            },
                          }}
                        />
                        {hasOffer &&
                          currentOriginal <= currentPrice &&
                          currentOriginal > 0 && (
                            <Typography
                              variant='caption'
                              color='error'
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                lineHeight: 1.1,
                              }}
                            >
                              El precio anterior debe ser mayor.
                            </Typography>
                          )}
                      </Collapse>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    {/* Presentación */}
                    <TextField
                      type='text'
                      placeholder='Opcional (Ej: 1 Litro)'
                      size='small'
                      {...register(`variants.${index}.storage`)}
                      sx={{ width: { xs: '70px', sm: '190px' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    {/* Color */}
                    <Button
                      onClick={(e) => handleColorOpen(e, index)}
                      variant='outlined'
                      size='small'
                      sx={{ minWidth: '50px' }}
                    >
                      {colorValues[index] && colorNameValues[index] ? (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: colorValues[index],
                          }}
                        />
                      ) : (
                        'Añadir (Opcional)'
                      )}
                    </Button>
                    <Popover
                      open={!!colorActive[index]}
                      anchorEl={colorActive[index]}
                      onClose={() => handleColorClose(index)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <TextField
                          type='color'
                          {...register(`variants.${index}.color`)}
                          size='small'
                          sx={{ width: '190px' }}
                        />
                        <TextField
                          type='text'
                          placeholder='Opcional (Ej: Rojo)'
                          {...register(`variants.${index}.colorName`)}
                          size='small'
                          sx={{ width: '190px' }}
                        />
                      </Box>
                    </Popover>
                  </TableCell>
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    {/* Terminación */}
                    <TextField
                      type='text'
                      placeholder='Opcional (Ej: Brillante)'
                      size='small'
                      {...register(`variants.${index}.finish`)}
                      sx={{ width: { xs: '70px', sm: '190px' } }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <Button
                      onClick={() => removeVariant(index)}
                      sx={{ minWidth: 'auto', p: 0 }}
                    >
                      <CancelIcon
                        sx={{ fontSize: '1.2rem', color: '#ef4444' }}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {errors.variants &&
        Array.isArray(errors.variants) &&
        errors.variants.length > 0 && (
          <Typography
            sx={{
              color: '#ef4444',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
            }}
          >
            {getFirstError(errors.variants[0])}
          </Typography>
        )}

      <Button
        type='button'
        onClick={addVariant}
        startIcon={<AddCircleIcon sx={{ color: '#25D366' }} />}
        sx={{
          alignSelf: 'center',
          textTransform: 'none',
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          fontWeight: 600,
          color: '#1e293b',
          '&:hover': { backgroundColor: '#f3f4f6' },
        }}
      >
        Añadir Variante
      </Button>

      {fields.length === 0 && errors.variants && (
        <Typography
          sx={{
            color: '#ef4444',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            textAlign: 'center',
          }}
        >
          Debes añadir al menos una variante
        </Typography>
      )}
    </Box>
  );
};
