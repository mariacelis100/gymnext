'use client'

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Grid,
  Checkbox,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '@/core/hooks/use-mock-auth';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface MemberFormData {
  phone: string;
  identityNumber: string;
  identityType: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date | null;
  role: string;
  membershipType: string;
  membershipDuration: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptClubMembership: boolean;
}

export default function MemberRegistrationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Formulario con valores iniciales
  const [formData, setFormData] = useState<MemberFormData>({
    phone: '',
    identityNumber: '',
    identityType: 'V',
    name: '',
    lastName: '',
    email: '',
    birthDate: null,
    role: 'client',
    membershipType: 'basic',
    membershipDuration: '1',
    acceptTerms: false,
    acceptMarketing: false,
    acceptClubMembership: false
  });

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_metadata.role !== 'admin' && user.user_metadata.role !== 'super_admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Pasos del formulario
  const steps = ['Información Personal', 'Tipo de Miembro', 'Términos y Condiciones'];

  // Manejar cambios en los campos del formulario
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manejar cambio en el campo de fecha
  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      birthDate: date
    });
  };

  // Validar el formulario según el paso actual
  const validateCurrentStep = () => {
    setFormError('');
    
    if (activeStep === 0) {
      // Validar información personal
      if (!formData.phone || !formData.identityNumber || !formData.name || !formData.lastName) {
        setFormError('Todos los campos son obligatorios');
        return false;
      }
      
      // Validar formato de teléfono: 04XX-XXXXXXX
      const phoneRegex = /^04\d{2}-\d{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        setFormError('El teléfono debe tener el formato 04XX-XXXXXXX');
        return false;
      }
      
      // Validar cédula: máximo 8 dígitos
      if (!/^\d{1,8}$/.test(formData.identityNumber)) {
        setFormError('La cédula debe tener máximo 8 dígitos numéricos');
        return false;
      }
      
      // Validar email si está presente
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setFormError('El correo electrónico no es válido');
        return false;
      }
    } else if (activeStep === 2) {
      // Validar términos y condiciones
      if (!formData.acceptTerms) {
        setFormError('Debe aceptar los términos y condiciones para continuar');
        return false;
      }
    }
    
    return true;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Procesar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      // Aquí iría la lógica para registrar al miembro en la base de datos
      // En una implementación real, se enviaría a una API o servidor
      console.log('Datos del formulario:', formData);
      
      // Simulamos un retraso para demostración
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRegistrationSuccess(true);
      
      // Reiniciar el formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          phone: '',
          identityNumber: '',
          identityType: 'V',
          name: '',
          lastName: '',
          email: '',
          birthDate: null,
          role: 'client',
          membershipType: 'basic',
          membershipDuration: '1',
          acceptTerms: false,
          acceptMarketing: false,
          acceptClubMembership: false
        });
        setActiveStep(0);
        setRegistrationSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      setFormError(error.message || 'Error al registrar el miembro');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Formatear el número de teléfono automáticamente
  const formatPhoneNumber = (value: string) => {
    // Eliminar caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Si no hay números, devolver cadena vacía
    if (numbers.length === 0) return '';
    
    // Aplicar formato 04XX-XXXXXXX
    if (numbers.length <= 4) {
      return numbers;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 11)}`;
    }
  };
  
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(event.target.value);
    setFormData({
      ...formData,
      phone: formattedPhone
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || (user.user_metadata.role !== 'admin' && user.user_metadata.role !== 'super_admin')) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Acceso Restringido
        </Typography>
        <Typography variant="body1" paragraph>
          No tienes permisos para acceder a esta página.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Registro de Nuevo Miembro
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Completa el formulario para registrar un nuevo miembro en el sistema.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {registrationSuccess ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            ¡Miembro registrado exitosamente!
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            {activeStep === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Información Personal
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <RadioGroup
                      row
                      name="identityType"
                      value={formData.identityType}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel value="V" control={<Radio />} label="V" />
                      <FormControlLabel value="E" control={<Radio />} label="E" />
                      <FormControlLabel value="J" control={<Radio />} label="J" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    label="Número de Cédula/Documento"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleInputChange}
                    variant="outlined"
                    inputProps={{ maxLength: 8 }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    variant="outlined"
                    placeholder="04XX-XXXXXXX"
                    inputProps={{ maxLength: 12 }}
                    required
                    helperText="Formato: 04XX-XXXXXXX"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha de Nacimiento"
                      value={formData.birthDate}
                      onChange={handleDateChange}
                      slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            )}
            
            {activeStep === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Tipo de Miembro y Membresía
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Rol del Miembro</FormLabel>
                    <RadioGroup
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    >
                      <FormControlLabel value="client" control={<Radio />} label="Cliente" />
                      <FormControlLabel value="trainer" control={<Radio />} label="Entrenador" />
                      <FormControlLabel value="admin" control={<Radio />} label="Administrador" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Divider sx={{ width: '100%', my: 2 }} />
                
                {formData.role === 'client' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Tipo de Membresía"
                        name="membershipType"
                        value={formData.membershipType}
                        onChange={handleInputChange}
                        variant="outlined"
                      >
                        <MenuItem value="basic">Básica</MenuItem>
                        <MenuItem value="premium">Premium</MenuItem>
                        <MenuItem value="vip">VIP</MenuItem>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Duración (meses)"
                        name="membershipDuration"
                        value={formData.membershipDuration}
                        onChange={handleInputChange}
                        variant="outlined"
                      >
                        <MenuItem value="1">1 mes</MenuItem>
                        <MenuItem value="3">3 meses</MenuItem>
                        <MenuItem value="6">6 meses</MenuItem>
                        <MenuItem value="12">12 meses</MenuItem>
                      </TextField>
                    </Grid>
                  </>
                )}
                
                {formData.role === 'trainer' && (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Los entrenadores tendrán acceso a la gestión de sus clientes asignados y podrán crear rutinas de ejercicios.
                    </Alert>
                  </Grid>
                )}
                
                {formData.role === 'admin' && (
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Los administradores tendrán acceso completo al sistema, incluyendo gestión de clientes, entrenadores y configuración general.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
            
            {activeStep === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Términos y Condiciones
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto', mb: 2 }}>
                    <Typography variant="body2" paragraph>
                      Al registrarte en GymNext, aceptas los siguientes términos y condiciones:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      1. La membresía es personal e intransferible.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      2. Los pagos realizados no son reembolsables.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      3. Debes presentar tu identificación en cada visita.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      4. GymNext no se hace responsable por objetos perdidos o robados.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      5. Nos reservamos el derecho de modificar horarios y servicios.
                    </Typography>
                  </Paper>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        name="acceptTerms"
                        required
                      />
                    }
                    label="Acepto los términos y condiciones"
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.acceptMarketing}
                        onChange={handleInputChange}
                        name="acceptMarketing"
                      />
                    }
                    label="Acepto recibir información promocional"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.acceptClubMembership}
                        onChange={handleInputChange}
                        name="acceptClubMembership"
                      />
                    }
                    label="Deseo unirme al club de beneficios"
                  />
                </Grid>
              </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Registrar Miembro'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
} 