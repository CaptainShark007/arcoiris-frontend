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

export const WhatsappButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenWhatsapp = () => {
    const message = encodeURIComponent(
      'Hola! Tengo una consulta sobre un producto.'
    );
    const phone = '5493624049548';
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
            {/* <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#25D366", width: 32, height: 32 }}>
                <WhatsAppIcon fontSize="small" />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                Atención al Cliente | Arcoiris
              </Typography>
            </Box> */}
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
                  Atención al Cliente
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.8 }}>
                  Arcoiris
                </Typography>
              </Box>
            </Box>
            {/* <IconButton size="small" onClick={toggleChat} sx={{ color: "grey.400" }}>
              <CloseIcon fontSize="small" />
            </IconButton> */}
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
              Abrir chat
            </Button>
          </Box>
        </Paper>
      </Fade>

      <Tooltip
        title={isOpen ? 'Cerrar' : 'Contáctanos por WhatsApp'}
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
