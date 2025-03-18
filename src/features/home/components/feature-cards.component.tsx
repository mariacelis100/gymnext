'use client';

import { Grid, Card, CardContent, Typography, Box, Container } from '@mui/material';

const features = [
  {
    icon: '🏋️‍♂️',
    title: 'ENTRENAMIENTO PERSONALIZADO',
    description: 'Planes adaptados a tus objetivos físicos y nivel de experiencia'
  },
  {
    icon: '⚡',
    title: 'ZONA OLD SCHOOL',
    description: 'Equipo especializado para entrenamiento clásico de alta intensidad'
  },
  {
    icon: '🎯',
    title: 'SEGUIMIENTO CONTINUO',
    description: 'Monitoreo constante de tu progreso con ajustes semanales'
  },
  {
    icon: '👥',
    title: 'CLASES GRUPALES',
    description: 'Entrena con la mejor compañía y motívate en comunidad'
  }
];

export const FeatureCards = () => {
  return (
    <Container maxWidth="lg">
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center',
          mb: 5,
          fontWeight: 800,
          textTransform: 'uppercase',
          color: 'white',
          textShadow: '0 0 10px rgba(0, 183, 255, 0.3)',
        }}
      >
        NUESTROS SERVICIOS
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderTop: '4px solid #00B7FF',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 183, 255, 0.1)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 30px rgba(0, 183, 255, 0.3)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    fontSize: '3.5rem',
                    textAlign: 'center',
                    mb: 2,
                    color: '#00B7FF',
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    fontSize: '1rem',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}; 