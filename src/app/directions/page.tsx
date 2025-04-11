'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  DirectionsBus, 
  DirectionsCar, 
  DirectionsWalk, 
  LocationOn 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function DirectionsPage() {
  const theme = useTheme();
  const gymLocation = {
    lat: 40.7128, // Replace with actual gym coordinates
    lng: -74.0060 // Replace with actual gym coordinates
  };

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
        Cómo Llegar
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Direcciones
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Dirección del Gimnasio" 
                  secondary="Calle Principal #123, Ciudad, País"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DirectionsCar color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="En Auto" 
                  secondary="Tome la autopista X y salga en la salida Y. Gire a la derecha en la calle Z."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DirectionsBus color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="En Transporte Público" 
                  secondary="Tome la línea de autobús A hasta la parada B. Caminar 5 minutos hacia el norte."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DirectionsWalk color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="A Pie" 
                  secondary="Desde el centro de la ciudad, caminar 15 minutos por la calle Principal."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Mapa
            </Typography>
            <Box 
              sx={{ 
                height: 400, 
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${gymLocation.lat},${gymLocation.lng}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 