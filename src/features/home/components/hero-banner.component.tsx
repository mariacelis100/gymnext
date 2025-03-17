'use client';

import { Box, Typography, Container } from '@mui/material';
import { useTheme } from '@/core/theme/theme-context';
import Image from 'next/image';

export const HeroBanner = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', sm: '50vh', md: '40vh' },
        overflow: 'hidden',
        mb: 4,
        backgroundColor: '#0A1A3F', // Fondo azul marino para combinar con el logo
      }}
    >
      {/* Contenedor de la imagen con posicionamiento controlado */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 26, 63, 0.4)', // Overlay más ligero
            zIndex: 1
          }
        }}
      >
        {/* Logo de COSMOS GYM como imagen central */}
        <Box 
          component="img"
          src="/images/logo/cosmos-gym-logo-white.png" 
          alt="COSMOS GYM"
          sx={{
            maxWidth: '80%',
            maxHeight: '50%',
            objectFit: 'contain',
            zIndex: 2,
            position: 'relative',
          }}
        />
      </Box>
      
      {/* Contenido superpuesto */}
      <Container
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 2,
          textAlign: 'center',
          pb: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 700,
            px: 2,
            py: 3,
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            ¡EL AMBIENTE OLD SCHOOL
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#00B7FF',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            QUE TE IMPULSA A SUPERAR TUS LÍMITES!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}; 