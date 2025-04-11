'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/core/hooks/use-mock-auth';
import { Box, Typography, Container, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UserRolePage() {
  const { user, loading, signIn } = useAuth();
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleTestLogin = async () => {
    try {
      setIsLoggingIn(true);
      setLoginStatus('Iniciando sesión...');
      await signIn('0414-2222222', '44444444');
      setLoginStatus('Inicio de sesión exitoso');
    } catch (error: any) {
      setLoginStatus(`Error al iniciar sesión: ${error.message}`);
      console.error('Error de inicio de sesión:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const goToAdmin = () => {
    router.push('/admin');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verificación de Rol de Usuario
      </Typography>

      <Box sx={{ my: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : user ? (
          <Box>
            <Typography variant="h6" gutterBottom>Usuario Autenticado</Typography>
            <Typography variant="body1">ID: {user.id}</Typography>
            <Typography variant="body1">Teléfono: {user.phone}</Typography>
            <Typography variant="body1">Nombre: {user.user_metadata.name} {user.user_metadata.lastName}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Rol: {user.user_metadata.role || 'No especificado'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }} 
              onClick={goToAdmin}
            >
              Ir al Panel de Administración
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" gutterBottom>
              No has iniciado sesión
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleTestLogin} 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <CircularProgress size={24} /> : 'Probar Login con Usuario de Prueba'}
            </Button>
            {loginStatus && (
              <Typography 
                variant="body2" 
                sx={{ mt: 2, color: loginStatus.includes('Error') ? 'error.main' : 'success.main' }}
              >
                {loginStatus}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
} 