'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Grid, 
  Typography, 
  Alert, 
  Paper,
  InputAdornment,
  FormHelperText,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/core/auth/auth-context';

interface FormData {
  phone: string;
  identityNumber: string;
  identityType: string;
  name: string;
  lastName: string;
  birthDate: Date | null;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptClubMembership: boolean;
  role: string;
}

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    identityNumber: '',
    identityType: 'V',
    name: '',
    lastName: '',
    birthDate: null,
    acceptTerms: false,
    acceptMarketing: false,
    acceptClubMembership: false,
    role: 'client' // Valor predeterminado
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const theme = useTheme();
  
  // Determinar si el usuario actual puede asignar todos los roles
  const isSuperAdmin = user?.user_metadata?.role === 'super_admin';
  
  // Función para formatear el teléfono mientras se escribe
  const formatPhoneInput = (value: string): string => {
    // Elimina cualquier carácter que no sea número
    let numbersOnly = value.replace(/\D/g, '');
    
    // Si hay números y no empieza con 0, añadir 0 al inicio
    if (numbersOnly.length > 0 && !numbersOnly.startsWith('0')) {
      numbersOnly = '0' + numbersOnly;
    }
    
    // Limitar a 11 dígitos (0 + 10 dígitos)
    numbersOnly = numbersOnly.slice(0, 11);
    
    // Aplicar formato 04XX-XXXXXXX
    if (numbersOnly.length <= 4) {
      return numbersOnly;
    } else {
      return `${numbersOnly.slice(0, 4)}-${numbersOnly.slice(4)}`;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const type = (e.target as HTMLInputElement).type;
    
    if (name === 'phone') {
      setFormData({
        ...formData,
        [name]: formatPhoneInput(value)
      });
    } else if (name === 'identityNumber') {
      // Solo permitir números y limitar a 8 caracteres
      const numbersOnly = value.replace(/\D/g, '').slice(0, 8);
      setFormData({
        ...formData,
        [name]: numbersOnly
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleDateChange = (newDate: Date | null) => {
    setFormData({
      ...formData,
      birthDate: newDate
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validaciones básicas
    if (!formData.phone || formData.phone.length < 11) {
      setError('Por favor ingresa un número de teléfono válido en el formato 04XX-XXXXXXX');
      return;
    }

    if (!formData.identityNumber || formData.identityNumber.length < 7 || formData.identityNumber.length > 8) {
      setError('El número de cédula debe tener 7 u 8 dígitos');
      return;
    }

    if (!formData.name.trim()) {
      setError('Por favor ingresa el nombre');
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Por favor ingresa el apellido');
      return;
    }

    if (!formData.birthDate) {
      setError('Por favor selecciona una fecha de nacimiento');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones para registrar al usuario');
      return;
    }
    
    try {
      // Aquí se enviarían los datos a la API para registrar al usuario
      // Por ahora, simularemos una operación exitosa
      
      // await signUp(formData); // Este método requiere adaptación para incluir el campo de rol
      
      // Simulación de registro exitoso
      setTimeout(() => {
        setSuccess('Usuario registrado exitosamente');
        // Resetear el formulario
        setFormData({
          phone: '',
          identityNumber: '',
          identityType: 'V',
          name: '',
          lastName: '',
          birthDate: null,
          acceptTerms: false,
          acceptMarketing: false,
          acceptClubMembership: false,
          role: 'client'
        });
      }, 1000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
    }
  };
  
  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#FFFFFF',
          color: theme.palette.mode === 'dark' ? '#E8E9EA' : 'inherit',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Registro de Nuevo Usuario
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required margin="normal">
                <InputLabel>Tipo de Documento</InputLabel>
                <Select
                  name="identityType"
                  value={formData.identityType}
                  onChange={handleChange}
                  label="Tipo de Documento"
                >
                  <MenuItem value="V">V</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="J">J</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Número de Cédula"
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleChange}
                inputProps={{ maxLength: 8 }}
                helperText="7-8 dígitos numéricos"
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="04XX-XXXXXXX"
                helperText="Formato: 04XX-XXXXXXX"
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: formData.phone ? null : (
                    <InputAdornment position="start">+58</InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={formData.birthDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      helperText: "Debe ser mayor de 18 años",
                      margin: "normal"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required margin="normal">
                <InputLabel>Rol de Usuario</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rol de Usuario"
                >
                  <MenuItem value="client">Cliente (Usuario Regular)</MenuItem>
                  <MenuItem value="trainer">Entrenador (Trainer)</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  {isSuperAdmin && (
                    <MenuItem value="super_admin">Super Administrador</MenuItem>
                  )}
                </Select>
                <FormHelperText>
                  {formData.role === 'client' && "Acceso básico a funciones de usuario"}
                  {formData.role === 'trainer' && "Acceso a administración de clientes y ejercicios"}
                  {formData.role === 'admin' && "Acceso a todas las funciones administrativas"}
                  {formData.role === 'super_admin' && "Acceso completo con privilegios extendidos"}
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.acceptTerms} 
                    onChange={handleChange} 
                    name="acceptTerms" 
                    color="primary" 
                  />
                }
                label="Acepta los términos y condiciones *"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.acceptMarketing} 
                    onChange={handleChange} 
                    name="acceptMarketing" 
                    color="primary" 
                  />
                }
                label="Acepta recibir comunicaciones de marketing"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.acceptClubMembership} 
                    onChange={handleChange} 
                    name="acceptClubMembership" 
                    color="primary" 
                  />
                }
                label="Inscribir como miembro del club"
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Registrar Usuario
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 