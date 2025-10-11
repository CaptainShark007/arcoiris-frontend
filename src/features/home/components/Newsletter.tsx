import { Box, Typography, TextField, Button, Container } from '@mui/material';

export const Newsletter = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Suscribirse');
  };

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h3" component="h2" fontWeight="bold">
            ¡No Te Pierdas Nada!
          </Typography>
          
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Suscríbete y recibe ofertas exclusivas antes que nadie
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              maxWidth: 600,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              type="email"
              placeholder="Tu correo electrónico"
              required
              sx={{
                flex: 1,
                bgcolor: 'white',
                borderRadius: 24,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ fontWeight: "bold", px: 4 }}
            >
              Suscribirse
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};