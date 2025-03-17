'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import { useTheme } from '@/core/theme/theme-context';

export const PromoBanner = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Box
      sx={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #0A0C10 0%, #1A1D23 100%)'
          : 'linear-gradient(135deg, #0A1A3F 0%, #122456 100%)',
        py: 5,
        mt: 3,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 0, md: 2 },
        mx: { xs: 0, md: 2 },
      }}
    >
      {/* Patrón de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url(/images/banner/cosmos-pattern.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                textTransform: 'uppercase',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: 'white',
                textShadow: '0 0 10px rgba(0, 183, 255, 0.5)',
              }}
            >
              ¡MARZO LLEGÓ
            </Typography>
            
            <Typography
              sx={{
                color: '#00B7FF',
                mb: 1,
                fontWeight: 500,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              con una nueva oportunidad
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mb: 4,
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              para alcanzar tus metas!
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: '#00B7FF',
                mb: 2,
                fontWeight: 800,
                textTransform: 'uppercase',
                fontSize: { xs: '1.8rem', md: '2.3rem' },
              }}
            >
              POR SOLO 40$
            </Typography>
            
            <Typography
              sx={{
                color: 'white',
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              obtén mensualidad + entrenador personal
            </Typography>
            
            <Typography
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 500,
              }}
            >
              que incluye:
            </Typography>
            
            {/* Lista de beneficios */}
            <Box sx={{ mb: 4 }}>
              {[
                {
                  icon: '🔄',
                  title: 'Plan de entrenamiento',
                  subtitle: 'diseñado a tu medida.',
                },
                {
                  icon: '👥',
                  title: 'Asesoría presencial y online',
                  subtitle: 'para resolver todas tus dudas.',
                },
                {
                  icon: '🥗',
                  title: 'Plan de nutrición',
                  subtitle: 'adaptado a tus objetivos.',
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 183, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontSize: '1.2rem',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#00B7FF',
                        fontSize: '0.9rem',
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          
          {/* Imagen */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              height: '100%',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                right: -50,
                bottom: -100,
                top: -100,
                width: '100%',
                backgroundImage: 'url(/images/banner/cosmos-pattern.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: isDarkMode ? 'brightness(0.8)' : 'brightness(1)',
                transition: 'filter 0.3s ease',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}; 