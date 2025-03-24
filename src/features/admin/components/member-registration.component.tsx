'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid, 
  Paper, 
  Checkbox, 
  FormControlLabel, 
  Link,
  FormHelperText,
  SelectChangeEvent,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/core/auth/auth-context';
import { supabase } from '@/core/supabase/client';

interface RegistrationFormData {
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  telefono: string;
  tipoUsuario: string;
  aceptaTerminos: boolean;
}

export default function MemberRegistration() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    nombre: '',
    apellidos: '',
    tipoDocumento: 'V',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    tipoUsuario: 'client',
    aceptaTerminos: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Limpiar error si el campo cambia
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name as string]) {
      setErrors({
        ...errors,
        [name as string]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Asegurar que comience con 0 si hay algún dígito
    if (value.length > 0 && value.match(/\d/)) {
      if (value[0] !== '0') value = '0' + value;
    }
    
    // Formatear como 04XX-XXXXXXX
    const digits = value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (digits.length <= 4) {
      formattedValue = digits;
    } else {
      formattedValue = `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
    }
    
    setFormData({
      ...formData,
      telefono: formattedValue
    });
    
    if (errors.telefono) {
      setErrors({
        ...errors,
        telefono: ''
      });
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Eliminar cualquier caracter que no sea número
    const digits = value.replace(/\D/g, '');
    
    // Formatear como dd/mm/aaaa
    let formattedValue = '';
    
    if (digits.length > 0) {
      // Agregar los primeros dos dígitos (día)
      formattedValue = digits.substring(0, Math.min(2, digits.length));
      
      // Agregar barra y los siguientes dos dígitos (mes)
      if (digits.length > 2) {
        formattedValue += '/' + digits.substring(2, Math.min(4, digits.length));
        
        // Agregar barra y los dígitos restantes (año)
        if (digits.length > 4) {
          formattedValue += '/' + digits.substring(4, Math.min(8, digits.length));
        }
      }
    }
    
    setFormData({
      ...formData,
      fechaNacimiento: formattedValue
    });
    
    if (errors.fechaNacimiento) {
      setErrors({
        ...errors,
        fechaNacimiento: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = 'El número de documento es obligatorio';
    } else if (!/^\d{7,8}$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento = 'La cédula debe tener entre 7 y 8 dígitos';
    }
    
    if (!formData.fechaNacimiento.trim()) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      // Validar formato dd/mm/aaaa
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(formData.fechaNacimiento)) {
        newErrors.fechaNacimiento = 'El formato debe ser dd/mm/aaaa';
      }
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else {
      // Validar formato 04XX-XXXXXXX
      const phoneRegex = /^04\d{2}-\d{7}$/;
      if (!phoneRegex.test(formData.telefono)) {
        newErrors.telefono = 'El formato debe ser 04XX-XXXXXXX';
      }
    }
    
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Función para formatear la fecha de dd/mm/aaaa a yyyy-mm-dd (formato ISO)
  const formatDateForDB = (date: string): string => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Usar la función create_user_with_phone_with_role del script fix_auth_link.sql
      // Esta función crea un usuario en auth.users primero y luego en members
      const { data, error } = await supabase.rpc('create_user_with_phone_with_role', {
        p_phone: formData.telefono,
        p_identity_number: formData.numeroDocumento,
        p_identity_type: formData.tipoDocumento,
        p_name: formData.nombre,
        p_last_name: formData.apellidos,
        p_birth_date: formatDateForDB(formData.fechaNacimiento),
        p_role_name: formData.tipoUsuario, // Pasar el rol seleccionado
        p_marketing_consent: false,
        p_club_member: false
      });

      if (error) {
        console.error('Error al registrar usuario:', error);
        
        // Mensajes de error específicos
        if (error.message?.includes('Ya existe un usuario con este número de teléfono') || 
            error.message?.includes('duplicate key') && error.message?.includes('phone')) {
          throw new Error('Ya existe un usuario con este número de teléfono');
        } 
        else if (error.message?.includes('Ya existe un usuario con este número de identidad') || 
                error.message?.includes('duplicate key') && error.message?.includes('identity_number')) {
          throw new Error('Ya existe un usuario con este número de documento');
        }
        else if (error.message?.includes('no existe la función')) {
          // Si la función con rol no existe, intentar con la función sin rol
          console.log('Intentando con función alternativa sin rol específico...');
          const { data: basicData, error: basicError } = await supabase.rpc('create_user_with_phone', {
            p_phone: formData.telefono,
            p_identity_number: formData.numeroDocumento,
            p_identity_type: formData.tipoDocumento,
            p_name: formData.nombre,
            p_last_name: formData.apellidos,
            p_birth_date: formatDateForDB(formData.fechaNacimiento),
            p_marketing_consent: false,
            p_club_member: false
          });
          
          if (basicError) {
            console.error('Error con función alternativa:', basicError);
            throw new Error(`Error al registrar usuario: ${basicError.message}`);
          }
          
          console.log('Usuario registrado con función básica:', basicData);
          setSuccessMessage('Usuario registrado correctamente (rol predeterminado: cliente)');
          
          // Limpiar formulario
          setFormData({
            nombre: '',
            apellidos: '',
            tipoDocumento: 'V',
            numeroDocumento: '',
            fechaNacimiento: '',
            telefono: '',
            tipoUsuario: 'client',
            aceptaTerminos: false
          });
          
          return;
        }
        
        throw new Error(`Error al registrar usuario: ${error.message}`);
      }
      
      console.log('Usuario registrado correctamente:', data);
      setSuccessMessage('Usuario registrado correctamente');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellidos: '',
        tipoDocumento: 'V',
        numeroDocumento: '',
        fechaNacimiento: '',
        telefono: '',
        tipoUsuario: 'client',
        aceptaTerminos: false
      });
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      setErrorMessage(error.message || 'Error al registrar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', pt: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Crea tu cuenta
        </Typography>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Nombre</Typography>
              <TextField
                fullWidth
                placeholder="Introduce tu nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Apellidos</Typography>
              <TextField
                fullWidth
                placeholder="Introduce tus apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Tipo y número de documento de identidad</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl sx={{ width: '80px' }}>
                  <Select
                    value={formData.tipoDocumento}
                    name="tipoDocumento"
                    onChange={handleSelectChange}
                    size="small"
                  >
                    <MenuItem value="V">V</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                    <MenuItem value="J">J</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  placeholder="12345678"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  error={!!errors.numeroDocumento}
                  helperText={errors.numeroDocumento || "La cédula debe tener entre 7 y 8 dígitos"}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 8 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Fecha de nacimiento (dd/mm/aaaa)</Typography>
              <TextField
                fullWidth
                placeholder="dd/mm/aaaa"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleDateChange}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento || "Formato: dd/mm/aaaa (ej. 15/06/1990)"}
                variant="outlined"
                size="small"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Teléfono</Typography>
              <TextField
                fullWidth
                placeholder="0"
                name="telefono"
                value={formData.telefono}
                onChange={handlePhoneChange}
                error={!!errors.telefono}
                helperText={errors.telefono || "Formato: 04XX-XXXXXXX (ej. 0412-1234567)"}
                variant="outlined"
                size="small"
                inputProps={{ maxLength: 12 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Tipo de usuario</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.tipoUsuario}
                  name="tipoUsuario"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="client">Cliente</MenuItem>
                  <MenuItem value="trainer">Entrenador</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="super_admin">Super Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.aceptaTerminos}
                    onChange={handleCheckboxChange}
                    name="aceptaTerminos"
                  />
                }
                label={
                  <Typography variant="body2">
                    Acepto las condiciones sobre <Link href="#" underline="hover">protección de datos y cookies</Link>.
                  </Typography>
                }
              />
              {errors.aceptaTerminos && (
                <FormHelperText error>{errors.aceptaTerminos}</FormHelperText>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 1, py: 1.5, borderRadius: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Crear Cuenta'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 