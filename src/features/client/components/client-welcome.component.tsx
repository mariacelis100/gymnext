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
              ¡Mantén tu racha de asistencia!
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Tabs para navegación de ejercicios */}
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            icon={<ChevronLeftIcon />} 
            label="Anteriores" 
            iconPosition="start"
          />
          <Tab 
            icon={<TodayIcon />} 
            label="Hoy" 
          />
          <Tab 
            icon={<ChevronRightIcon />} 
            label="Próximos" 
            iconPosition="end"
          />
        </Tabs>
      </Paper>
      
      {/* Vista swipeable de ejercicios */}
      <SwipeableViews
        index={tabIndex}
        onChangeIndex={handleChangeIndex}
        enableMouseEvents
      >
        {/* Ejercicios pasados */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ejercicios de días anteriores
          </Typography>
          {pastExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => handleOpenExerciseDialog(exercise)}
            >
              <CardMedia
                component="img"
                height="160"
                image={exercise.image}
                alt={exercise.name}
                onError={(e: any) => {
                  e.target.src = placeholderImage;
                }}
              />
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" component="div">
                    {exercise.name}
                  </Typography>
                  {exercise.completed ? (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Completado" 
                      color="success" 
                      size="small" 
                    />
                  ) : (
                    <Chip 
                      icon={<CancelIcon />} 
                      label="No completado" 
                      color="error" 
                      size="small" 
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {exercise.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exercise.sets} series × {exercise.reps} repeticiones
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {/* Ejercicios de hoy */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ejercicios para hoy
          </Typography>
          {todayExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => handleOpenExerciseDialog(exercise)}
            >
              <CardMedia
                component="img"
                height="160"
                image={exercise.image}
                alt={exercise.name}
                onError={(e: any) => {
                  e.target.src = placeholderImage;
                }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exercise.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exercise.sets} series × {exercise.reps} repeticiones
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {/* Ejercicios futuros */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Próximos ejercicios
          </Typography>
          {futureExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              sx={{ mb: 2, cursor: 'pointer' }} 
              onClick={() => handleOpenExerciseDialog(exercise)}
            >
              <CardMedia
                component="img"
                height="160"
                image={exercise.image}
                alt={exercise.name}
                onError={(e: any) => {
                  e.target.src = placeholderImage;
                }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exercise.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exercise.sets} series × {exercise.reps} repeticiones
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Programado para: {new Date(exercise.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </SwipeableViews>
      
      {/* Diálogo para QR Code */}
      <Dialog 
        open={qrDialogOpen} 
        onClose={() => setQrDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Escanea tu código para check-in</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <QRCodePlaceholder 
              value="GymNext-CheckIn-123456789"
              size={250}
            />
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Muestra este código al personal del gimnasio para registrar tu asistencia
          </Typography>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para detalles de ejercicio */}
      <Dialog 
        open={exerciseDialogOpen} 
        onClose={() => setExerciseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedExercise && (
          <>
            <DialogTitle>{selectedExercise.name}</DialogTitle>
            <DialogContent>
              <Box>
                <CardMedia
                  component="img"
                  height="250"
                  image={selectedExercise.image}
                  alt={selectedExercise.name}
                  onError={(e: any) => {
                    e.target.src = placeholderImage;
                  }}
                />
                
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Detalles del ejercicio
                </Typography>
                <Typography variant="body1">
                  {selectedExercise.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Series:</strong> {selectedExercise.sets}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Repeticiones:</strong> {selectedExercise.reps}
                  </Typography>
                </Box>
                
                {new Date(selectedExercise.date) <= new Date() && !selectedExercise.completed && (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 3 }}
                    onClick={handleCompleteExercise}
                  >
                    Marcar como completado
                  </Button>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
} 