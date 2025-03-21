'use client';

import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, Avatar, Rating, useTheme, Divider, Paper } from '@mui/material';
import { ThemeProvider } from '@/core/theme/theme-context';
import Link from 'next/link';
import Image from 'next/image';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Usamos dynamic import con ssr: false para evitar problemas de hidratación
// para componentes que pueden tener código específico del cliente
const DynamicNavBar = dynamic(
  () => import('@/features/home/components/nav-bar.component').then(mod => ({ default: mod.NavBar })), 
  { ssr: false }
);

// Nuevo componente de banner con la imagen correctamente centrada
const DynamicHeroBanner = dynamic(
  () => import('@/features/home/components/hero-banner.component').then(mod => ({ default: mod.HeroBanner })),
  { ssr: false }
);

// Botones flotantes de redes sociales
const DynamicSocialButtons = dynamic(
  () => import('@/features/home/components/social-floating-buttons.component').then(mod => ({ default: mod.SocialFloatingButtons })),
  { ssr: false }
);

// Rutas de imágenes para el carrusel del banner principal
const bannerImages = [
  '/images/services/actividades_dirigidas.jpg',
  '/images/services/musculación_2.jpg',
  '/images/services/area_cardio.jpg',
  '/images/services/musculación_3.jpg',
  '/images/services/cosmos-pattern.png'
];

// Datos para testimonios
const testimonials = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Desde que me uní a Cosmos Gym, mi físico y mi energía han mejorado enormemente. Los entrenadores son increíbles y el ambiente me motiva cada día.'
  },
  {
    id: 2,
    name: 'María Gómez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Las clases dirigidas son mi parte favorita. He conocido gente increíble y los resultados son visibles. ¡El mejor gimnasio de la ciudad!'
  },
  {
    id: 3,
    name: 'Andrés López',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'La aplicación móvil hace que sea muy fácil seguir mis rutinas y ver mi progreso. Recomiendo Cosmos Gym a todos mis amigos.'
  }
];

// Datos para servicios
const services = [
  {
    id: 1,
    title: 'Actividades Dirigidas',
    image: '/images/services/actividades_dirigidas.jpg',
    description: 'Clases de Cycle Indoor, BodyPump, Step, Zumba, Pilates y mucho más con los mejores instructores.'
  },
  {
    id: 2,
    title: 'Musculación',
    image: '/images/services/musculación_2.jpg',
    description: 'Amplia variedad de equipos modernos para todos los grupos musculares y niveles de experiencia.'
  },
  {
    id: 3,
    title: 'Cardio Avanzado',
    image: '/images/services/area_cardio.jpg',
    description: 'Máquinas de última generación para maximizar tu rendimiento cardiovascular y quemar calorías.'
  },
  {
    id: 4,
    title: 'Zona Funcional',
    image: '/images/services/musculación_3.jpg',
    description: 'Entrenamiento dinámico con kettlebells, TRX, battle ropes y más para mejorar tu fuerza y resistencia.'
  }
];

export default function Home() {
  const theme = useTheme();
  const [currentBannerImage, setCurrentBannerImage] = useState(0);
  
  // Efecto para cambiar la imagen del banner cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerImage((prev) => (prev + 1) % bannerImages.length);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <ThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Barra de navegación */}
        <DynamicNavBar />

        {/* Banner principal - Hero Section con carrusel de imágenes */}
        <Box 
          sx={{ 
            position: 'relative', 
            height: { xs: '70vh', md: '80vh' }, 
            backgroundImage: `linear-gradient(rgba(135, 206, 250, 0.7), rgba(0, 183, 255, 0.5)), url(${bannerImages[currentBannerImage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(1.05)',
            display: 'flex',
            alignItems: 'center',
            mb: 6,
            transition: 'background-image 1s ease-in-out',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              zIndex: 0
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ color: 'white', py: 4, maxWidth: { md: '60%' } }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                }}
              >
                COSMOS GYM
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                }}
              >
                En Cosmos Gym te ayudamos a alcanzar tus objetivos fitness con los mejores equipos y entrenadores especializados en entrenamiento al estilo Old School, por eso, ¡Tu mejor versión empieza aquí!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  component={Link}
                  href="/register"
                  size="large"
                  sx={{ 
                    bgcolor: '#00B7FF', 
                    '&:hover': { 
                      bgcolor: '#0095D9',
                      boxShadow: '0 8px 16px rgba(0, 183, 255, 0.4)'
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  COMENZAR AHORA
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link}
                  href="/login"
                  size="large"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { 
                      borderColor: '#00B7FF', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)'
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  INICIAR SESIÓN
                </Button>
              </Box>
            </Box>
          </Container>

          {/* Indicadores del carrusel (puntos) */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 2
            }}
          >
            {bannerImages.map((_, index) => (
              <Box 
                key={index} 
                onClick={() => setCurrentBannerImage(index)}
                sx={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  bgcolor: index === currentBannerImage ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Por qué elegirnos */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 5, 
              color: '#444444',
              position: 'relative',
              '&:after': {
                content: '""',
                width: '80px',
                height: '3px',
                bgcolor: '#00B7FF',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }}
          >
            ¿POR QUÉ ELEGIRNOS?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ height: '100%', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <FitnessCenterIcon sx={{ fontSize: 60, color: '#00B7FF', mb: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight="bold" mb={2} color="#000000">
                    Equipamiento Premium
                  </Typography>
                  <Typography variant="body1">
                    Contamos con las máquinas más modernas y un espacio diseñado para maximizar tus resultados.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ height: '100%', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 60, color: '#00B7FF', mb: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight="bold" mb={2} color="#000000">
                    Horarios Flexibles
                  </Typography>
                  <Typography variant="body1">
                    Abierto todos los días con amplios horarios adaptados a tu rutina diaria.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ height: '100%', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <EmojiEventsIcon sx={{ fontSize: 60, color: '#00B7FF', mb: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight="bold" mb={2} color="#000000">
                    Entrenadores Elite
                  </Typography>
                  <Typography variant="body1">
                    Profesionales certificados y dedicados a ayudarte a alcanzar tu máximo potencial.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ height: '100%', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <GroupIcon sx={{ fontSize: 60, color: '#00B7FF', mb: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight="bold" mb={2} color="#000000">
                    Comunidad Activa
                  </Typography>
                  <Typography variant="body1">
                    Forma parte de un grupo motivado que comparte tus mismos objetivos y pasión.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Servicios Destacados */}
        <Box sx={{ bgcolor: 'rgba(0, 183, 255, 0.05)', py: 8 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h2" 
              align="center" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 5, 
                color: '#444444',
                position: 'relative',
                '&:after': {
                  content: '""',
                  width: '80px',
                  height: '3px',
                  bgcolor: '#00B7FF',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }
              }}
            >
              NUESTROS SERVICIOS
            </Typography>
            
            <Grid container spacing={4}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={3} key={service.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'scale(1.03)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <Box sx={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={service.image}
                        alt={service.title}
                        sx={{ 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          transition: 'transform 0.5s',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                        onError={(e) => {
                          // Imagen de respaldo si la original falla
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" fontWeight="bold" color="#000000">
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                href="/servicios"
                sx={{ 
                  bgcolor: '#00B7FF', 
                  '&:hover': { 
                    bgcolor: '#0095D9',
                    boxShadow: '0 8px 16px rgba(0, 183, 255, 0.4)'
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                VER TODOS LOS SERVICIOS
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Sección de promoción con imagen */}
        <Box sx={{ 
          position: 'relative', 
          height: { xs: '400px', md: '500px' }, 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          my: 8,
          color: 'white',
          textAlign: 'center'
        }}>
          <Container maxWidth="md">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
              }}
            >
              ÚNETE A COSMOS GYM HOY
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
              }}
            >
              Primer mes con 50% de descuento en cualquiera de nuestros planes
            </Typography>
            <Button 
              variant="contained" 
              component={Link}
              href="/register"
              size="large"
              sx={{ 
                bgcolor: '#00B7FF', 
                '&:hover': { 
                  bgcolor: '#0095D9',
                  boxShadow: '0 8px 16px rgba(0, 183, 255, 0.4)'
                },
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              ¡QUIERO ESTE DESCUENTO!
            </Button>
          </Container>
        </Box>

        {/* Testimonios */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 5, 
              color: '#444444',
              position: 'relative',
              '&:after': {
                content: '""',
                width: '80px',
                height: '3px',
                bgcolor: '#00B7FF',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }}
          >
            LO QUE DICEN NUESTROS CLIENTES
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ width: 70, height: 70, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#000000">
                        {testimonial.name}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly precision={0.5} size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ flex: 1, fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Final */}
        <Box sx={{ 
          bgcolor: '#0A1A3F', 
          color: 'white', 
          py: 6,
          textAlign: 'center'
        }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" fontWeight="bold" mb={2}>
              ¿LISTO PARA UNIRTE A COSMOS GYM?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Da el primer paso hacia el mejor físico de tu vida
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                component={Link}
                href="/register"
                size="large"
                sx={{ 
                  bgcolor: '#00B7FF', 
                  '&:hover': { 
                    bgcolor: '#0095D9',
                    boxShadow: '0 8px 16px rgba(0, 183, 255, 0.4)'
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                REGISTRARME AHORA
              </Button>
              <Button 
                variant="outlined" 
                component={Link}
                href="/contacto"
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { 
                    borderColor: '#00B7FF', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)'
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                MÁS INFORMACIÓN
              </Button>
            </Box>
          </Container>
        </Box>
        
        {/* Botones flotantes de redes sociales */}
        <DynamicSocialButtons />
      </Box>
    </ThemeProvider>
  );
}
