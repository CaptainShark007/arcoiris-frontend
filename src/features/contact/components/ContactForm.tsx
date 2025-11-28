import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import {
  contactFormSchema,
  ContactFormValues,
} from '../schemas/contact.schema';

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert('¡Mensaje enviado con éxito!');
    reset();
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',
          sm: '90%',
          md: '80%',
          lg: '60%',
        },
        mx: 'auto',
        my: { xs: 2, md: 3 },
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
      }}
      noValidate
    >
      <Typography
        variant='h3'
        component='h2'
        sx={{
          mb: { xs: 2, md: 3 },
          fontSize: {
            xs: '1.75rem', // 28px
            sm: '2rem', // 32px
            md: '2.5rem', // 40px
          },
          textAlign: 'center',
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Pongámonos en contacto
      </Typography>

      <Typography
        variant='body1'
        color='text.secondary'
        sx={{
          mb: { xs: 3, md: 4 },
          textAlign: { xs: 'left', sm: 'center' },
          fontSize: { xs: '0.95rem', sm: '1rem' },
          lineHeight: 1.6,
        }}
      >
        No dude en enviarnos su consulta o pedido de cotización. En breve nos
        estaremos comunicando con usted. Estamos para servirle.
      </Typography>

      {/* CONTENEDOR DE INPUTS */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, sm: 3 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
          },
        }}
      >
        <TextField
          label='Su nombre *'
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          size='medium'
        />

        <TextField
          label='Número de teléfono *'
          fullWidth
          defaultValue='+54'
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          size='medium'
        />

        <TextField
          label='Su correo electrónico'
          fullWidth
          type='email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          size='medium'
        />

        <TextField
          label='Asunto *'
          fullWidth
          {...register('subject')}
          error={!!errors.subject}
          helperText={errors.subject?.message}
          size='medium'
        />

        {/* Campo de mensaje (ocupa 2 columnas) */}
        <TextField
          label='Su pregunta *'
          fullWidth
          multiline
          rows={4}
          sx={{
            gridColumn: {
              xs: 'span 1',
              sm: 'span 2',
            },
          }}
          {...register('message')}
          error={!!errors.message}
          helperText={errors.message?.message}
        />
      </Box>

      {/* Botón */}
      <Button
        type='submit'
        variant='contained'
        size='large'
        disabled={isSubmitting}
        fullWidth
        sx={{
          mt: { xs: 3, md: 4 },
          py: { xs: 1.5, sm: 1.75 },
          fontSize: { xs: '0.95rem', sm: '1rem' },
          fontWeight: 600,
        }}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
    </Box>
  );
};
