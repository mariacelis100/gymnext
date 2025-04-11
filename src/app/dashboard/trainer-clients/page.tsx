'use client';

import { Box, Container, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useAuth } from '@/core/hooks/use-mock-auth';
import { useRouter } from 'next/navigation';
import { ClientExercisesRepository, ClientExercise } from '@/core/repositories/client-exercises-repository';

interface Client {
  id: string;
  name: string;
  lastName: string;
  exercises: ClientExercise[];
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  image?: string;
}

export default function TrainerClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const exercisesRepository = new ClientExercisesRepository();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'trainer')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        // Fetch trainer's clients
        const trainerClients = await exercisesRepository.getTrainerClients(user.id);
        
        // Fetch exercises for each client
        const clientsWithExercises = await Promise.all(
          trainerClients.map(async (client) => {
            const exercises = await exercisesRepository.getClientExercises(client.id);
            return {
              id: client.id,
              name: client.name,
              lastName: client.last_name,
              exercises
            };
          })
        );

        setClients(clientsWithExercises);
        setLoadingData(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        console.error('Error fetching data:', err);
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !user?.id) return;

    const { source, destination, draggableId } = result;
    const exercise = availableExercises.find(ex => ex.id === draggableId);

    if (!exercise) return;

    try {
      // Create new exercise assignment
      const newExercise = await exercisesRepository.assignExercise({
        client_id: destination.droppableId,
        trainer_id: user.id,
        exercise_name: exercise.name,
        description: exercise.description,
        sets: exercise.sets,
        reps: exercise.reps,
        image_url: exercise.image
      });

      // Update local state
      const newClients = clients.map(client => {
        if (client.id === destination.droppableId) {
          return {
            ...client,
            exercises: [...client.exercises, newExercise]
          };
        }
        return client;
      });
      setClients(newClients);

      // Remove from available exercises
      const newAvailableExercises = availableExercises.filter(ex => ex.id !== draggableId);
      setAvailableExercises(newAvailableExercises);
    } catch (err) {
      setError('Error al asignar el ejercicio. Por favor, intenta de nuevo.');
      console.error('Error assigning exercise:', err);
    }
  };

  const handleRemoveExercise = async (clientId: string, exerciseId: string) => {
    try {
      await exercisesRepository.removeExercise(exerciseId);
      
      // Update local state
      const newClients = clients.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            exercises: client.exercises.filter(ex => ex.id !== exerciseId)
          };
        }
        return client;
      });
      setClients(newClients);
    } catch (err) {
      setError('Error al eliminar el ejercicio. Por favor, intenta de nuevo.');
      console.error('Error removing exercise:', err);
    }
  };

  if (loading || loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#666666' }}>
        Gestión de Clientes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          {/* Lista de ejercicios disponibles */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666666' }}>
                Ejercicios Disponibles
              </Typography>
              <Droppable droppableId="exercises">
                {(provided: DroppableProvided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: 200 }}
                  >
                    {availableExercises.map((exercise, index) => (
                      <Draggable
                        key={exercise.id}
                        draggableId={exercise.id}
                        index={index}
                      >
                        {(provided: DraggableProvided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 1,
                              backgroundColor: '#f5f5f5',
                              cursor: 'grab'
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ color: '#666666' }}>
                              {exercise.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666666' }}>
                              {exercise.sets} series x {exercise.reps} repeticiones
                            </Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>

          {/* Lista de clientes */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#666666' }}>
                Clientes Asignados
              </Typography>
              <Grid container spacing={2}>
                {clients.map((client) => (
                  <Grid item xs={12} key={client.id}>
                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#666666' }}>
                        {client.name} {client.lastName}
                      </Typography>
                      <Droppable droppableId={client.id}>
                        {(provided: DroppableProvided) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ minHeight: 100 }}
                          >
                            {client.exercises.map((exercise, index) => (
                              <Paper
                                key={exercise.id}
                                sx={{
                                  p: 2,
                                  mb: 1,
                                  backgroundColor: '#e3f2fd',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <Box>
                                  <Typography variant="subtitle1" sx={{ color: '#666666' }}>
                                    {exercise.exercise_name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666666' }}>
                                    {exercise.sets} series x {exercise.reps} repeticiones
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#666666',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#f44336' }
                                  }}
                                  onClick={() => handleRemoveExercise(client.id, exercise.id)}
                                >
                                  Eliminar
                                </Typography>
                              </Paper>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DragDropContext>
    </Container>
  );
} 