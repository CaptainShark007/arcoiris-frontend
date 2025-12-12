import React, { useEffect, useState } from 'react';
import {
  FieldErrors,
  Control,
  useFieldArray,
  UseFormRegister,
  useWatch,
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
} from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

interface VariantsProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

const headersVariants = [
  'Stock',
  'Precio',
  'Presentación',
  'Color',
  'Terminación',
  '',
];

export const VariantsInput = ({ control, errors, register }: VariantsProps) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'variants',
  });

  const [colorActive, setColorActive] = useState<(HTMLElement | null)[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const addVariant = () => {
    append({
      stock: 0,
      price: 0,
      storage: '',
      finish: '',
      color: '',
      colorName: '',
    });
  };

  const removeVariant = (index: number) => {
    remove(index);
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
          icon={false} // Opcional: quitar ícono para ahorrar espacio
          sx={{
            mb: 1.5,
            py: 0,
            backgroundColor: '#eff6ff',
            color: '#1e3a8a',
            '& .MuiAlert-message': { padding: '8px 0' },
          }}
        >
          <Typography variant='caption' sx={{ fontSize: '0.75rem' }}>
            <InfoOutlineIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> <strong>Nota:</strong> La primera variante de la lista será la
            que se muestre por defecto(en primera posición) en las tarjetas de producto.
          </Typography>
        </Alert>
        {fields.map((field, index) => (
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

            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
              >
                Stock
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
                Precio
              </Typography>
              <TextField
                type='number'
                placeholder='Precio'
                size='small'
                fullWidth
                inputProps={{ step: '0.01' }}
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
              />
            </Box>

            <Box>
              <Typography
                sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}
              >
                Presentación
              </Typography>
              <TextField
                type='text'
                placeholder='1 Litro'
                size='small'
                fullWidth
                {...register(`variants.${index}.storage`)}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
              />
            </Box>

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
                  'Seleccionar color'
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
                    sx={{ width: '100px' }}
                  />
                  <TextField
                    type='text'
                    placeholder='Negro'
                    {...register(`variants.${index}.colorName`)}
                    size='small'
                    sx={{ width: '100px' }}
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
                placeholder='Brillante'
                size='small'
                fullWidth
                {...register(`variants.${index}.finish`)}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
              />
            </Box>
          </Box>
        ))}

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
        icon={false} // Opcional: quitar ícono para ahorrar espacio
        sx={{
          mb: 1.5,
          py: 0,
          backgroundColor: '#eff6ff',
          color: '#1e3a8a',
          '& .MuiAlert-message': { padding: '8px 0' },
        }}
      >
        <Typography variant='caption' sx={{ fontSize: '0.75rem' }}>
          <InfoOutlineIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> <strong>Nota:</strong> La primera variante de la lista será la que
          se muestre por defecto(en primera posición) en las tarjetas de producto.
        </Typography>
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
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
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
                <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
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
                </TableCell>
                <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <TextField
                    type='text'
                    placeholder='1 Litro'
                    size='small'
                    {...register(`variants.${index}.storage`)}
                    sx={{ width: { xs: '70px', sm: '80px' } }}
                  />
                </TableCell>
                <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
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
                      'Añadir'
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
                        sx={{ width: '100px' }}
                      />
                      <TextField
                        type='text'
                        placeholder='Negro'
                        {...register(`variants.${index}.colorName`)}
                        size='small'
                        sx={{ width: '100px' }}
                      />
                    </Box>
                  </Popover>
                </TableCell>
                <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <TextField
                    type='text'
                    placeholder='Brillante'
                    size='small'
                    {...register(`variants.${index}.finish`)}
                    sx={{ width: { xs: '70px', sm: '90px' } }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <Button
                    onClick={() => removeVariant(index)}
                    sx={{ minWidth: 'auto', p: 0 }}
                  >
                    <CancelIcon sx={{ fontSize: '1.2rem', color: '#ef4444' }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
