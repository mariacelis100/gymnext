'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  IconButton, 
  Badge, 
  Card, 
  CardMedia, 
  CardContent, 
  Tabs, 
  Tab, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Button,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import { 
  QrCode as QrCodeIcon, 
  LocalFireDepartment as FireIcon, 
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';

// QR Code placeholder - reemplazar con componente real cuando esté disponible
const QRCodePlaceholder = ({ value, size = 200 }: { value: string, size?: number }) => {
  return (
    <Box 
      sx={{ 
        width: size, 
        height: size, 
        bgcolor: '#f5f5f5', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        border: '1px solid #ccc',
        borderRadius: 1
      }}
    >
      <QrCodeIcon sx={{ fontSize: 80, color: '#000', mb: 2 }} />
      <Typography variant="body2" textAlign="center" sx={{ px: 2 }}>
        {value}
      </Typography>
    </Box>
  );
};

// Modelo de ejercicio
interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
  videoUrl?: string;
  sets: number;
  reps: number;
  completed?: boolean;
  date: string;
}

// Datos de ejemplo de ejercicios
const pastExercises: Exercise[] = [
  {
    id: 'past1',
    name: 'Press de Banca',
    description: 'Ejercicio para pecho',
    image: '/images/exercises/bench-press.jpg',
    sets: 4,
    reps: 12,
    completed: true,
    date: '2023-03-20'
  },
  {
    id: 'past2',
    name: 'Sentadillas',
    description: 'Ejercicio para piernas',
    image: '/images/exercises/squats.jpg',
    sets: 3,
    reps: 15,
    completed: false,
    date: '2023-03-19'
  },
  {
    id: 'past3',
    name: 'Dominadas',
    description: 'Ejercicio para espalda',
    image: '/images/exercises/pull-ups.jpg',
    sets: 3,
    reps: 10,
    completed: true,
    date: '2023-03-18'
  }
];

const todayExercises: Exercise[] = [
  {
    id: 'today1',
    name: 'Press Militar',
    description: 'Ejercicio para hombros',
    image: '/images/exercises/military-press.jpg',
    sets: 4,
    reps: 10,
    date: '2023-03-21'
  },
  {
    id: 'today2',
    name: 'Peso Muerto',
    description: 'Ejercicio compuesto para espalda baja',
    image: '/images/exercises/deadlift.jpg',
    sets: 3,
    reps: 8,
    date: '2023-03-21'
  }
];

const futureExercises: Exercise[] = [
  {
    id: 'future1',
    name: 'Curl de Bíceps',
    description: 'Ejercicio para brazos',
    image: '/images/exercises/bicep-curl.jpg',
    sets: 4,
    reps: 12,
    date: '2023-03-22'
  },
  {
    id: 'future2',
    name: 'Extensiones de Tríceps',
    description: 'Ejercicio para brazos',
    image: '/images/exercises/tricep-extension.jpg',
    sets: 3,
    reps: 15,
    date: '2023-03-23'
  }
];

// Componente principal de bienvenida para clientes
export default function ClientWelcome() {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(1); // 0: Past, 1: Today, 2: Future
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Streak de días - normalmente vendría de la base de datos
  const [streak, setStreak] = useState(7);
  
  // Para manejar el swipe
  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  // Abrir diálogo de QR
  const handleOpenQrDialog = () => {
    setQrDialogOpen(true);
  };
  
  // Abrir diálogo de ejercicio
  const handleOpenExerciseDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseDialogOpen(true);
  };
  
  // Marcar ejercicio como completado
  const handleCompleteExercise = () => {
    if (selectedExercise) {
      // Aquí iría la lógica para marcar el ejercicio como completado en la base de datos
      alert(`Ejercicio ${selectedExercise.name} marcado como completado`);
      setExerciseDialogOpen(false);
    }
  };

  // Usar placeholders para imágenes que no existen
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMwMEI3RkYiLz48cGF0aCBkPSJNODAgODBIMTIwVjEyMEg4MFY4MFoiIGZpbGw9IiMwQTFBM0YiLz48L3N2Zz4=';
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
      {/* Cabecera de usuario y check-in */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt="User Profile" 
              src={placeholderImage}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">¡Bienvenido!</Typography>
              <Typography variant="body2" color="text.secondary">
                Tu entrenamiento te espera hoy
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton 
              color="primary" 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark
                }
              }} 
              onClick={handleOpenQrDialog}
            >
              <QrCodeIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      {/* Contador de streak */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <FireIcon sx={{ color: '#FF4500', fontSize: 22 }} />
            }
          >
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: 60, 
                height: 60,
                border: '3px solid #FF4500'
              }}
            >
              <Typography variant="h5">{streak}</Typography>
            </Avatar>
          </Badge>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{streak} días seguidos</Typography>
            <Typography variant="body2" color="text.secondary">
              ¡Sigue así! Mantén tu racha de ejercicios.
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Navegación de ejercicios */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              '.MuiTab-root': { 
                minHeight: '50px'
              }
            }}
          >
            <Tab label="Anteriores" icon={<ChevronLeftIcon />} iconPosition="start" />
            <Tab label="Hoy" icon={<TodayIcon />} iconPosition="start" />
            <Tab label="Próximos" icon={<ChevronRightIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Vista deslizable para ejercicios */}
        <SwipeableViews
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          {/* Ejercicios anteriores */}
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Últimos 3 días
              </Typography>
            </Box>
            {pastExercises.map((exercise) => (
              <Card key={exercise.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleOpenExerciseDialog(exercise)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={placeholderImage}
                    alt={exercise.name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exercise.name}
                      </Typography>
                      <Chip 
                        icon={exercise.completed ? <CheckCircleIcon /> : <CancelIcon />} 
                        label={exercise.completed ? "Completado" : "Pendiente"}
                        color={exercise.completed ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.sets} series × {exercise.reps} repeticiones
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(exercise.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
          
          {/* Ejercicios de hoy */}
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Ejercicios para hoy
              </Typography>
            </Box>
            {todayExercises.map((exercise) => (
              <Card key={exercise.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleOpenExerciseDialog(exercise)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={placeholderImage}
                    alt={exercise.name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exercise.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.sets} series × {exercise.reps} repeticiones
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {exercise.description}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
          
          {/* Ejercicios futuros */}
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Próximos ejercicios
              </Typography>
            </Box>
            {futureExercises.map((exercise) => (
              <Card key={exercise.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleOpenExerciseDialog(exercise)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={placeholderImage}
                    alt={exercise.name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exercise.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.sets} series × {exercise.reps} repeticiones
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Programado: {new Date(exercise.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Box>
        </SwipeableViews>
      </Paper>
      
      {/* Diálogo para mostrar el código QR */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle>Tu código de acceso</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <QRCodePlaceholder value="Usuario: JohnDoe, ID: 12345" />
            <Typography variant="body2" sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
              Muestra este código al personal del gimnasio para registrar tu entrada.
            </Typography>
            <Button variant="contained" onClick={() => setQrDialogOpen(false)} sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para detalles del ejercicio */}
      <Dialog open={exerciseDialogOpen} onClose={() => setExerciseDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedExercise && (
          <>
            <DialogTitle>{selectedExercise.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 200, borderRadius: 1, mb: 2 }}
                  image={placeholderImage}
                  alt={selectedExercise.name}
                />
                <Typography variant="body1" gutterBottom>
                  {selectedExercise.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Series:</strong> {selectedExercise.sets}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Repeticiones:</strong> {selectedExercise.reps}
                </Typography>
                {selectedExercise.date && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Fecha:</strong> {new Date(selectedExercise.date).toLocaleDateString()}
                  </Typography>
                )}
                
                {/* Botones de acción */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button variant="outlined" onClick={() => setExerciseDialogOpen(false)}>
                    Cerrar
                  </Button>
                  
                  {tabIndex === 1 && ( // Solo mostrar para ejercicios de hoy
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={handleCompleteExercise}
                    >
                      Marcar como completado
                    </Button>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
