'use client';

import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, useMediaQuery, Box, Typography, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import { useState } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '@/core/theme/theme-context';
import Image from 'next/image';

export const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Logo real en vez del temporal
  const logoSrc = isDarkMode 
    ? '/images/logo/cosmos-gym-logo-white.png' // Versión clara para tema oscuro
    : '/images/logo/cosmos-gym-logo-blue.png';  // Versión azul para tema claro

  // Definir los ítems del menú con textos exactamente como en la imagen
  const menuItems = [
    { 
      text: 'Planes', 
      icon: <FitnessCenterIcon />,
      altText: 'Ícono de planes de entrenamiento' 
    },
    { 
      text: 'Horario', 
      icon: <AccessTimeIcon />,
      altText: 'Ícono de horarios' 
    },
    { 
      text: 'Ubicación', 
      icon: <LocationOnIcon />,
      altText: 'Ícono de ubicación'
    },
    { 
      text: 'Contacto', 
      icon: <WhatsAppIcon />,
      altText: 'Ícono de contacto'
    },
    { 
      text: 'Máquinas', 
      icon: <SportsGymnasticsIcon />,
      altText: 'Ícono de máquinas'
    },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ 
        backgroundColor: isDarkMode 
          ? 'rgba(10, 12, 16, 0.95)' // Fondo oscuro para tema oscuro
          : 'rgba(10, 26, 63, 0.95)', // Fondo azul para tema claro
        backdropFilter: 'blur(10px)' 
      }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              
              <Box sx={{ ml: 'auto', height: 40, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ height: 40, width: 120, position: 'relative', backgroundColor: 'transparent' }}>
                  <Image 
                    src={logoSrc}
                    alt="COSMOS GYM"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                
                {/* Botón de cambio de tema para móvil */}
                <IconButton 
                  color="inherit" 
                  onClick={toggleTheme}
                  sx={{ ml: 1 }}
                  aria-label="Cambiar tema"
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ height: 40, width: 150, position: 'relative', backgroundColor: 'transparent' }}>
                <Image 
                  src={logoSrc}
                  alt="COSMOS GYM"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, ml: 'auto', alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button 
                    key={item.text}
                    color="inherit"
                    startIcon={
                      <Avatar 
                        sx={{ 
                          bgcolor: '#040d1f', 
                          width: 32, 
                          height: 32,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                        }}
                      >
                        {item.icon}
                      </Avatar>
                    }
                    sx={{
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 183, 255, 0.1)',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {/* Botón de cambio de tema para desktop */}
                <IconButton 
                  color="inherit" 
                  onClick={toggleTheme}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                  aria-label="Cambiar tema"
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ 
          width: 250, 
          bgcolor: isDarkMode ? '#0A0C10' : '#0A1A3F', 
          height: '100%', 
          color: 'white' 
        }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <Box sx={{ height: 40, width: 150, position: 'relative' }}>
              <Image 
                src={logoSrc}
                alt="COSMOS GYM"
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>
          
          {/* Menú de navegación con estilo de íconos con texto */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 2, 
            p: 2,
            mb: 2 
          }}>
            {menuItems.map((item) => (
              <Box
                key={item.text}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '40%',
                  mb: 2
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: '#040d1f', 
                    width: 50, 
                    height: 50,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 500,
                    color: 'white'
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <Button 
                  sx={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    pl: 2,
                    py: 1.5,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 183, 255, 0.1)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: '#040d1f', 
                      width: 32, 
                      height: 32,
                      mr: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  {item.text}
                </Button>
              </ListItem>
            ))}
            
            {/* Opción de cambio de tema en el menú */}
            <ListItem disablePadding>
              <Button 
                onClick={toggleTheme}
                sx={{ 
                  width: '100%', 
                  justifyContent: 'flex-start', 
                  pl: 2,
                  py: 1.5,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 183, 255, 0.1)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: '#040d1f', 
                    width: 32, 
                    height: 32,
                    mr: 2,
                    color: 'white',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.1rem'
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </Avatar>
                {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}; 