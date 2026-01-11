import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import {
  contactFormSchema,
  ContactFormValues,
} from '../schemas/contact.schema';
import { enviarEmailContacto } from '@/services/emailContactService';

interface ContactFormProps {
  partnerEmail?: string | null;
}

export const ContactForm = ({ partnerEmail }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // 3. (Opcional) Combinamos los datos del formulario con el email del socio
    // para que tu servicio sepa a quién enviar el correo.
    const datosParaEnviar = {
        ...data,
        destinationEmail: partnerEmail // Asegúrate que tu servicio maneje esto
    };

    // Nota: Si 'enviarEmailContacto' no acepta parámetros extra, 
    // tendrás que actualizar ese servicio también.
    // Por ahora, lo paso como estaba pero asumiendo que modificarás el servicio:
    
    const promise = enviarEmailContacto(datosParaEnviar as any).then((resultado) => {
      if (!resultado.success) {
        throw new Error(resultado.error || 'Error desconocido');
      }
      return resultado;
    });

    await toast.promise(promise, {
      loading: 'Enviando mensaje...',
      success: () => {
        reset(); 
        return '¡Mensaje enviado con éxito! Te contactaremos pronto.';
      },
      error: 'Hubo un problema al enviar el mensaje. Intente nuevamente.',
    });
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '60%' },
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
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
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

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, sm: 3 },
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        }}
      >
        <TextField
          label='Su nombre *'
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label='Número de teléfono *'
          fullWidth
          defaultValue='+54'
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <TextField
          label='Su correo electrónico'
          fullWidth
          type='email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label='Asunto *'
          fullWidth
          {...register('subject')}
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <TextField
          label='Su pregunta *'
          fullWidth
          multiline
          rows={4}
          sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
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
