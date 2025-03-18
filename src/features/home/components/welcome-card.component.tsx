'use client';

import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@/core/theme/theme-context';

export const WelcomeCard = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Card 
      sx={{ 
        maxWidth: 600,
        margin: '20px auto',
        padding: '20px',
        borderRadius: '15px',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <IconButton 
        onClick={toggleTheme}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <CardContent>
        <Typography 
          variant="h4" 
          component="div"
          sx={{ 
            marginBottom: 1,
            textTransform: 'uppercase',
            background: 'linear-gradient(45deg, #00B7FF, #2A3544)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          COSMOS GYM
        </Typography>

        <Typography 
          variant="h6"
          sx={{ 
            marginBottom: 2,
            color: 'text.secondary',
            letterSpacing: '0.05em',
          }}
        >
          Fitness • Musculación • Cardio
        </Typography>

        <Box sx={{ 
          my: 3,
          p: 2,
          borderLeft: '4px solid #00B7FF',
          backgroundColor: isDarkMode ? 'rgba(42, 53, 68, 0.3)' : 'rgba(0, 183, 255, 0.1)',
        }}>
          <Typography 
            variant="h5"
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            🫵🏻 Tu mejor versión empieza aquí
          </Typography>
        </Box>

        <Typography 
          variant="body1"
          sx={{ 
            fontSize: '1.1rem',
            my: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          💥 Entrenamiento al estilo Old School
        </Typography>

        <Typography 
          variant="caption"
          sx={{ 
            display: 'block',
            mt: 2,
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          Gym/Physical Fitness Center
        </Typography>
      </CardContent>
    </Card>
  );
}; 