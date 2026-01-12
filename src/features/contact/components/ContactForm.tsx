import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import toast from 'react-hot-toast';
import {
  contactFormSchema,
  ContactFormValues,
} from '../schemas/contact.schema';
import { enviarEmailContacto } from '@/services/emailContactService';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  partnerEmail?: string | null;
}

export const ContactForm = ({ partnerEmail }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    const payload = {
      ...data, 
      destinationEmail: partnerEmail 
    };

    const promise = enviarEmailContacto(payload).then((resultado) => {
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 1,
        bgcolor: 'background.paper',
        height: '100%',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography
          variant='overline'
          color='primary'
          fontWeight="bold"
          sx={{ letterSpacing: 1.5 }}
        >
          CONTACTO
        </Typography>

        <Typography
          variant='h4'
          component='h2'
          sx={{
            mt: 1,
            mb: 2,
            fontWeight: 800,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', md: '2.2rem' }
          }}
        >
          Envíanos un mensaje
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 4, maxWidth: '600px', lineHeight: 1.7 }}
        >
          ¿Tienes alguna duda o proyecto en mente? Completa el formulario y nuestro equipo te responderá a la brevedad.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <TextField
            label='Su nombre'
            variant="outlined"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
          <TextField
            label='Teléfono'
            variant="outlined"
            fullWidth
            defaultValue='+54'
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
          <TextField
            label='Correo electrónico'
            variant="outlined"
            fullWidth
            type='email'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ sx: { borderRadius: 1 } }}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />
          <TextField
            label='Asunto'
            variant="outlined"
            fullWidth
            {...register('subject')}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            InputProps={{ sx: { borderRadius: 1 } }}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          <TextField
            label='¿En qué podemos ayudarte?'
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
            {...register('message')}
            error={!!errors.message}
            helperText={errors.message?.message}
            InputProps={{ sx: { borderRadius: 1 } }}
          />
        </Box>

        <Button
          type='submit'
          variant='contained'
          size='large'
          disabled={isSubmitting}
          fullWidth
          endIcon={<SendIcon />}
          sx={{
            mt: 4,
            py: 2,
            borderRadius: 1,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1.1rem',
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.2)'
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </Box>
    </Paper>
  );
};