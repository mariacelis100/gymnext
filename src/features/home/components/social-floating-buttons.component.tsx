'use client';

import { Box, Fab, Tooltip, Zoom } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useState, useEffect } from 'react';

export const SocialFloatingButtons = () => {
  const [visible, setVisible] = useState(false);

  // Mostrar botones después de un scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Número de WhatsApp y usuario de Instagram
  const whatsappNumber = '584122731575'; // Número de WhatsApp de COSMOS GYM
  const instagramUrl = 'https://www.instagram.com/cosmosgymbqto'; // URL directa de Instagram

  // URLs para enlaces
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20planes%20de%20entrenamiento`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <Tooltip title="Seguinos en Instagram" placement="left" arrow>
        <Zoom in={visible}>
          <Fab
            color="secondary"
            aria-label="Instagram"
            sx={{
              bgcolor: '#E1306C',
              '&:hover': {
                bgcolor: '#C13584',
              },
            }}
            onClick={() => window.open(instagramUrl, '_blank')}
          >
            <InstagramIcon />
          </Fab>
        </Zoom>
      </Tooltip>

      <Tooltip title="Contactanos por WhatsApp" placement="left" arrow>
        <Zoom in={visible}>
          <Fab
            color="secondary"
            aria-label="WhatsApp"
            sx={{
              bgcolor: '#25D366',
              '&:hover': {
                bgcolor: '#128C7E',
              },
            }}
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <WhatsAppIcon />
          </Fab>
        </Zoom>
      </Tooltip>
    </Box>
  );
}; 