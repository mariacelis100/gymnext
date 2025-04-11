'use client'

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  useTheme,
  Checkbox,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from 'next/navigation';

// Tipo para los clientes de entrenadores
interface TrainerClient {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  checkedIn: boolean;
  lastCheckIn?: string;
  assignedProgram?: string;
  plan?: string;
}

// Tipo para entrenadores
interface Trainer {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  email?: string;
  specialty: string;
  status: 'active' | 'inactive' | 'on_leave';
  clients: TrainerClient[];
  avatar?: string;
  docType?: string;
  docNumber?: string;
  clientCount: number;
}

// Tipo para ejercicios
interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
}

export default function TrainerManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [clientsDialogOpen, setClientsDialogOpen] = useState(false);
  const [exercisesDialogOpen, setExercisesDialogOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showClientsDialog, setShowClientsDialog] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  
  useEffect(() => {
    // En una implementación real, aquí se cargarían los datos desde la API
    const mockTrainers: Trainer[] = [
      { 
        id: 1, 
        name: 'Roberto', 
        lastName: 'Sánchez', 
        phone: '0412-9876543', 
        email: 'roberto.sanchez@example.com',
        specialty: 'Musculación',
        status: 'active',
        clients: [
          { id: 1, name: 'Juan', lastName: 'Pérez', phone: '0412-1234567', checkedIn: true, assignedProgram: 'Hipertrofia' },
          { id: 2, name: 'María', lastName: 'Rodríguez', phone: '0414-7654321', checkedIn: true, assignedProgram: 'Pérdida de peso' },
          { id: 3, name: 'Carlos', lastName: 'González', phone: '0424-9876543', checkedIn: false },
          { id: 4, name: 'Ana', lastName: 'Martínez', phone: '0416-3456789', checkedIn: false, assignedProgram: 'Tonificación' }
        ],
        avatar: 'https://example.com/roberto.jpg',
        docType: 'DNI',
        docNumber: '12345678',
        clientCount: 4
      },
      { 
        id: 2, 
        name: 'Luisa', 
        lastName: 'Torres', 
        phone: '0414-1234567', 
        specialty: 'Cardio y HIIT',
        status: 'active',
        clients: [
          { id: 5, name: 'Pedro', lastName: 'Ramírez', phone: '0412-5678901', checkedIn: true, assignedProgram: 'Cardio' },
          { id: 6, name: 'Laura', lastName: 'García', phone: '0424-1234567', checkedIn: false }
        ],
        avatar: 'https://example.com/luisa.jpg',
        docType: 'DNI',
        docNumber: '87654321',
        clientCount: 2
      },
      { 
        id: 3, 
        name: 'Miguel', 
        lastName: 'Fernández', 
        phone: '0424-5432109', 
        email: 'miguel.fernandez@example.com',
        specialty: 'CrossFit',
        status: 'on_leave',
        clients: [
          { id: 7, name: 'Carolina', lastName: 'Díaz', phone: '0412-8765432', checkedIn: false, assignedProgram: 'CrossFit Básico' },
          { id: 8, name: 'Fernando', lastName: 'López', phone: '0414-9876543', checkedIn: false, assignedProgram: 'CrossFit Avanzado' },
        ],
        avatar: 'https://example.com/miguel.jpg',
        docType: 'DNI',
        docNumber: '98765432',
        clientCount: 2
      }
    ];
    
    // Ejercicios de ejemplo
    const mockExercises: Exercise[] = [
      { 
        id: 1, 
        name: 'Press de banca', 
        description: 'Ejercicio compuesto para pecho y tríceps', 
        muscleGroup: 'Pecho', 
        difficulty: 'intermediate' 
      },
      { 
        id: 2, 
        name: 'Sentadillas', 
        description: 'Ejercicio compuesto para piernas y glúteos', 
        muscleGroup: 'Piernas', 
        difficulty: 'beginner' 
      },
      { 
        id: 3, 
        name: 'Peso muerto', 
        description: 'Ejercicio compuesto para espalda y piernas', 
        muscleGroup: 'Espalda', 
        difficulty: 'advanced' 
      },
      { 
        id: 4, 
        name: 'Pull-ups', 
        description: 'Ejercicio para espalda y bíceps', 
        muscleGroup: 'Espalda', 
        difficulty: 'intermediate' 
      },
      { 
        id: 5, 
        name: 'Press militar', 
        description: 'Ejercicio para hombros', 
        muscleGroup: 'Hombros', 
        difficulty: 'intermediate' 
      },
    ];
    
    setTrainers(mockTrainers);
    setExercises(mockExercises);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredTrainers = trainers.filter(trainer => {
    if (activeTab === 1 && trainer.status !== 'active') return false;
    if (activeTab === 2 && trainer.status === 'active') return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      trainer.name.toLowerCase().includes(searchLower) ||
      trainer.lastName.toLowerCase().includes(searchLower) ||
      trainer.phone.includes(searchTerm) ||
      trainer.specialty.toLowerCase().includes(searchLower) ||
      (trainer.email && trainer.email.toLowerCase().includes(searchLower))
    );
  });
  
  const handleViewClients = (trainer: Trainer) => {
    router.push(`/dashboard/trainer-clients?trainerId=${trainer.id}`);
  };
  
  const handleAssignExercises = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setSelectedExercises([]);
    setSelectedClients([]);
    setExercisesDialogOpen(true);
  };
  
  const toggleExerciseSelection = (exerciseId: number) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };
  
  const toggleClientSelection = (clientId: number) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };
  
  const getStatusColor = (status: Trainer['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };
  
  const getStatusText = (status: Trainer['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'on_leave': return 'Permiso';
      default: return 'Desconocido';
    }
  };
  
  const handleAddNewTrainer = () => {
    // Implementa la lógica para agregar un nuevo entrenador
    console.log("Agregar nuevo entrenador");
  };
  
  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setShowEditDialog(true);
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#666666' }}>
        Gestión de Entrenadores
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Buscar entrenador..."
          variant="outlined"
          size="small"
          sx={{ width: '60%' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PersonAddIcon />}
          onClick={handleAddNewTrainer}
        >
          Nuevo Entrenador
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTab-root': {
              color: '#666666',
            }
          }}
        >
          <Tab label="Todos" />
          <Tab label="Activos" />
          <Tab label="Inactivos" />
        </Tabs>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Entrenador</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Especialidad</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Clientes Asignados</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainers.map((trainer) => (
              <TableRow key={trainer.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={trainer.avatar} alt={trainer.name} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: '#666666' }}>
                        {trainer.name} {trainer.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.docType}-{trainer.docNumber}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#666666' }}>{trainer.specialty}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666666' }}>{trainer.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">{trainer.email}</Typography>
                </TableCell>
                <TableCell sx={{ color: '#666666' }}>
                  {trainer.clientCount} clientes
                </TableCell>
                <TableCell>
                  <Chip 
                    label={trainer.status === 'active' ? 'Activo' : 'Inactivo'} 
                    color={trainer.status === 'active' ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEditTrainer(trainer)}
                      title="Editar entrenador"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleViewClients(trainer)}
                      title="Ver clientes asignados"
                    >
                      <GroupIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Modal de edición de entrenador */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#666666' }}>
          Editar Entrenador
          <IconButton
            aria-label="close"
            onClick={() => setShowEditDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#666666' }}>
            {selectedTrainer && `${selectedTrainer.name} ${selectedTrainer.lastName}`}
          </Typography>
          
          {/* Formulario de edición */}
          {/* ... existing code ... */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de clientes asignados */}
      <Dialog 
        open={showClientsDialog} 
        onClose={() => setShowClientsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#666666' }}>
          Clientes Asignados
          <IconButton
            aria-label="close"
            onClick={() => setShowClientsDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#666666' }}>
            {selectedTrainer && `Clientes asignados a ${selectedTrainer.name} ${selectedTrainer.lastName}`}
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Plan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTrainer?.clients?.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell sx={{ color: '#666666' }}>{client.name} {client.lastName}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{client.phone}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{client.plan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClientsDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 