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
  Avatar,
  useTheme,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeIcon from '@mui/icons-material/QrCode';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';

// Componente placeholder para el código QR
const QRCodePlaceholder = ({ value, size = 200 }: { value: string, size?: number }) => {
  return (
    <Box 
      sx={{ 
        width: size, 
        height: size, 
        bgcolor: '#f0f0f0', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        m: 'auto',
        borderRadius: 2,
        p: 2,
        textAlign: 'center'
      }}
    >
      <QrCodeIcon sx={{ fontSize: 80, color: '#000', mb: 2 }} />
      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{value}</Typography>
    </Box>
  );
};

interface Customer {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | 'expired';
  membershipType: string;
  membershipEnd: string;
  lastCheckIn?: string;
  trainer?: string;
  plan?: string;
}

export default function CustomerManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openExercisesDialog, setOpenExercisesDialog] = useState(false);
  const theme = useTheme();
  
  useEffect(() => {
    // En una implementación real, aquí se cargarían los datos desde la API
    const mockCustomers: Customer[] = [
      { 
        id: 1, 
        name: 'Juan', 
        lastName: 'Pérez', 
        phone: '0412-1234567', 
        email: 'juan.perez@example.com',
        status: 'active',
        membershipType: 'Premium',
        membershipEnd: '2024-12-31',
        lastCheckIn: '2023-06-15 08:30:00',
        trainer: 'Roberto Sánchez',
        plan: 'Hipertrofia'
      },
      { 
        id: 2, 
        name: 'María', 
        lastName: 'Rodríguez', 
        phone: '0414-7654321', 
        email: 'maria.rodriguez@example.com',
        status: 'active',
        membershipType: 'Básico',
        membershipEnd: '2024-10-15',
        lastCheckIn: '2023-06-14 17:45:00',
        trainer: 'Luisa Torres',
        plan: 'Pérdida de peso'
      },
      { 
        id: 3, 
        name: 'Carlos', 
        lastName: 'González', 
        phone: '0424-9876543', 
        status: 'inactive',
        membershipType: 'Premium',
        membershipEnd: '2024-05-01'
      },
      { 
        id: 4, 
        name: 'Ana', 
        lastName: 'Martínez', 
        phone: '0416-3456789', 
        email: 'ana.martinez@example.com',
        status: 'expired',
        membershipType: 'Básico',
        membershipEnd: '2023-12-01',
        lastCheckIn: '2023-11-30 10:15:00',
        trainer: 'Roberto Sánchez',
        plan: 'Tonificación'
      },
      { 
        id: 5, 
        name: 'Pedro', 
        lastName: 'Ramírez', 
        phone: '0412-5678901', 
        status: 'active',
        membershipType: 'Premium',
        membershipEnd: '2025-01-15',
        lastCheckIn: '2023-06-15 09:00:00',
        trainer: 'Luisa Torres',
        plan: 'Cardio'
      }
    ];
    
    setCustomers(mockCustomers);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredCustomers = customers.filter(customer => {
    // Filtro por estado según la pestaña activa
    if (activeTab === 1 && customer.status !== 'active') return false;
    if (activeTab === 2 && customer.status !== 'inactive') return false;
    if (activeTab === 3 && customer.status !== 'expired') return false;
    
    // Filtro por término de búsqueda
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.trainer && customer.trainer.toLowerCase().includes(searchLower))
    );
  });
  
  const handleShowQR = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenQRDialog(true);
  };
  
  const handleAssignExercises = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenExercisesDialog(true);
  };
  
  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusText = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'expired': return 'Expirado';
      default: return 'Desconocido';
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#666666' }}>
        Gestión de Clientes
      </Typography>
      
      <TextField
        fullWidth
        margin="normal"
        placeholder="Buscar por nombre, apellido, teléfono o entrenador"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 2,
          '& .MuiTab-root': { 
            color: '#666666',
            '&.Mui-selected': { 
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#00B7FF', 
              fontWeight: 'bold'
            }
          }
        }}
      >
        <Tab label="Todos los Clientes" />
        <Tab label="Clientes Activos" />
        <Tab label="Clientes Inactivos" />
        <Tab label="Membresías Expiradas" />
      </Tabs>
      
      <TableContainer 
        component={Paper}
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#FFFFFF',
          color: theme.palette.mode === 'dark' ? '#E8E9EA' : 'inherit',
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[3]
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#2A3544' : '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Tipo de Membresía</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Fin de Membresía</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Último Ingreso</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#666666' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell sx={{ color: '#666666' }}>{customer.name}</TableCell>
                  <TableCell sx={{ color: '#666666' }}>{customer.lastName}</TableCell>
                  <TableCell sx={{ color: '#666666' }}>{customer.phone}</TableCell>
                  <TableCell sx={{ color: '#666666' }}>{customer.membershipType}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {customer.membershipEnd}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.lastCheckIn ? (
                      customer.lastCheckIn.split(' ')[0]
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(customer.status)}
                      color={getStatusColor(customer.status)}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleShowQR(customer)}
                        title="Ver QR de acceso"
                      >
                        <QrCodeIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleAssignExercises(customer)}
                        title="Asignar rutina"
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="subtitle1" sx={{ py: 3 }}>
                    No se encontraron clientes con los criterios de búsqueda actuales.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Diálogo para mostrar el código QR del cliente */}
      <Dialog 
        open={openQRDialog} 
        onClose={() => setOpenQRDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#FFFFFF',
            color: theme.palette.mode === 'dark' ? '#E8E9EA' : 'inherit',
          }
        }}
      >
        <DialogTitle sx={{ color: '#666666' }}>
          Código QR de Acceso
          <IconButton
            aria-label="close"
            onClick={() => setOpenQRDialog(false)}
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
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              {selectedCustomer && (
                <QRCodePlaceholder 
                  value={`ID:${selectedCustomer.id},Nombre:${selectedCustomer.name},Apellido:${selectedCustomer.lastName},Teléfono:${selectedCustomer.phone}`} 
                  size={250}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Card 
                variant="outlined" 
                sx={{ 
                  textAlign: 'center',
                  bgcolor: theme.palette.mode === 'dark' ? '#2A3544' : '#f7f7f7',
                  p: 2,
                  mt: 2
                }}
              >
                <Typography variant="body1" gutterBottom>
                  Este código QR puede ser escaneado para registrar la asistencia del cliente.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comparta este código con el cliente para facilitar el proceso de check-in.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRDialog(false)}>Cerrar</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Aquí iría la lógica para descargar o compartir el código QR
              console.log("Compartir código QR para", selectedCustomer?.name);
              setOpenQRDialog(false);
            }}
          >
            Compartir Código QR
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para asignar ejercicios */}
      <Dialog 
        open={openExercisesDialog} 
        onClose={() => setOpenExercisesDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#FFFFFF',
            color: theme.palette.mode === 'dark' ? '#E8E9EA' : 'inherit',
          }
        }}
      >
        <DialogTitle sx={{ color: '#666666' }}>
          Asignar Ejercicios
          <IconButton
            aria-label="close"
            onClick={() => setOpenExercisesDialog(false)}
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
            {selectedCustomer && `${selectedCustomer.name} ${selectedCustomer.lastName}`}
          </Typography>
          
          {/* Aquí iría el contenido para asignar ejercicios */}
          <Typography sx={{ color: '#666666' }}>
            Funcionalidad en desarrollo...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExercisesDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            disabled
            onClick={() => {
              console.log("Asignar ejercicios a", selectedCustomer?.name);
              setOpenExercisesDialog(false);
            }}
          >
            Guardar Ejercicios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 