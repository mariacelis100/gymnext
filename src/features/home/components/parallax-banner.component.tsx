'use client';

import { Box, Typography, Container } from '@mui/material';
import { useTheme } from '@/core/theme/theme-context';

export const ParallaxBanner = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Box
      sx={{
        height: { xs: '40vh', sm: '50vh', md: '60vh' },
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
        background: isDarkMode
          ? 'radial-gradient(circle at right, #1A1D23 0%, #0A0C10 100%)'
          : 'radial-gradient(circle at right, #122456 0%, #0A1A3F 100%)',
      }}
    >
      {/* Patrón geométrico de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: `url(/images/banner/cosmos-pattern.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      
      {/* Efecto de puntos/grid */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(0, 183, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 1,
        }}
      />
      
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            maxWidth: 600,
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 900,
              mb: 2,
              color: 'white',
              textShadow: '0 0 20px rgba(0, 183, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            COSMOS GYM
          </Typography>
          
          <Typography 
            variant="h4"
            sx={{ 
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
              fontWeight: 600,
              mb: 3,
              color: '#00B7FF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Fitness • Musculación • Cardio
          </Typography>
          
          <Box
            sx={{
              p: 2,
              borderLeft: '4px solid #00B7FF',
              backgroundColor: 'rgba(0, 183, 255, 0.1)',
              maxWidth: 450,
              backdropFilter: 'blur(5px)',
              mb: 3,
            }}
          >
            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 700,
                color: 'white',
              }}
            >
              🫵🏻 Tu mejor versión empieza aquí
            </Typography>
          </Box>
          
          <Typography 
            variant="h6"
            sx={{ 
              fontWeight: 600,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            💥 Entrenamiento al estilo Old School
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}; 