import { useState } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {
  Fab,
  Tooltip,
  Paper,
  Box,
  Typography,
  Button,
  Fade,
  Avatar,
} from '@mui/material';
import { useCurrentPartner } from '@shared/hooks';

const DEFAULT_PHONE = '5493624049548';
const DEFAULT_NAME = 'Atención al Cliente';

export const WhatsappButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data: partner } = useCurrentPartner();

  const displayPhone = partner?.phone || DEFAULT_PHONE;
  const displayName = partner?.name || DEFAULT_NAME;
  const displayRole = partner ? 'Asesor Comercial' : 'Arcoiris';

  const handleOpenWhatsapp = () => {
    const cleanPhone = displayPhone.replace(/\D/g, ''); 
    
    const message = encodeURIComponent(
      'Hola! Tengo una consulta sobre un producto.'
    );
    
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <Fade in={isOpen}>
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 110,
            right: 40,
            width: 300,
            borderRadius: 1,
            overflow: 'hidden',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f5f5f5',
          }}
        >
          <Box
            sx={{
              bgcolor: '#1f2937',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                bgcolor: '#1f2937',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: '#25D366', width: 32, height: 32 }}>
                <WhatsAppIcon fontSize='small' />
              </Avatar>
              <Box>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  lineHeight={1.2}
                >
                  {displayName}
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.8 }}>
                  {displayRole}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: '#e5e7eb', minHeight: 100 }}>
            <Box
              sx={{
                bgcolor: 'white',
                p: 2,
                borderRadius: '0px 12px 12px 12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                maxWidth: '90%',
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                Hola 👋 <br />
                ¿En qué podemos ayudarte hoy?
              </Typography>
            </Box>
            <Typography
              variant='caption'
              color='text.disabled'
              sx={{ mt: 1, display: 'block' }}
            >
              Solemos responder en pocos minutos.
            </Typography>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Button
              variant='contained'
              fullWidth
              onClick={handleOpenWhatsapp}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              startIcon={isHovered ? <SendIcon /> : <WhatsAppIcon />}
              sx={{
                bgcolor: '#25D366',
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#25D366',
                },
              }}
            >
              Abrir chat con {partner ? partner.name.split(' ')[0] : 'nosotros'}
            </Button>
          </Box>
        </Paper>
      </Fade>

      <Tooltip
        title={isOpen ? 'Cerrar' : `Contactar a ${partner ? partner.name : 'Soporte'}`}
        placement='left'
      >
        <Fab
          color='success'
          aria-label='whatsapp'
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            bgcolor: '#25D366',
            zIndex: 10000,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            '&:hover': {
              bgcolor: '#1EBE57',
            },
          }}
        >
          {isOpen ? (
            <CloseIcon sx={{ color: 'white' }} />
          ) : (
            <WhatsAppIcon sx={{ color: 'white' }} />
          )}
        </Fab>
      </Tooltip>
    </>
  );
};
