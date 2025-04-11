'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

const pages = [
  {
    title: 'Home',
    path: '/',
    description: 'Página principal del gimnasio con información general y promociones.'
  },
  {
    title: 'Admin Dashboard',
    path: '/admin',
    description: 'Panel de administración para gestionar usuarios, clientes, entrenadores y noticias.'
  },
  {
    title: 'Welcome',
    path: '/welcome',
    description: 'Página de bienvenida para usuarios autenticados con historias y publicaciones.'
  },
  {
    title: 'User Role',
    path: '/user-role',
    description: 'Página para seleccionar el rol de usuario y acceder a las diferentes funcionalidades.'
  },
  {
    title: 'Trainer Clients',
    path: '/dashboard/trainer-clients',
    description: 'Panel para entrenadores donde pueden gestionar sus clientes y sus rutinas.'
  },
  {
    title: 'Cómo Llegar',
    path: '/directions',
    description: 'Instrucciones detalladas sobre cómo llegar al gimnasio en diferentes medios de transporte.'
  }
];

export default function NavigationPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h2" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          mb: 6,
          color: theme.palette.primary.main,
          position: 'relative',
          '&:after': {
            content: '""',
            width: '80px',
            height: '3px',
            bgcolor: theme.palette.primary.main,
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }
        }}
      >
        Navegación del Sitio
      </Typography>

      <Grid container spacing={4}>
        {pages.map((page) => (
          <Grid item xs={12} sm={6} md={4} key={page.path}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardActionArea component={Link} href={page.path}>
                <CardContent>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                  >
                    {page.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {page.description}
                  </Typography>
                  <MuiLink
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Ir a {page.title} →
                  </MuiLink>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 