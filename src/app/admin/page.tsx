'use client'

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import Dashboard from '@/features/admin/components/dashboard.component';
import { useAuth } from '@/core/auth/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado y es admin o super_admin
    if (!loading) {
      if (!user) {
        // No está autenticado, redirigir al login
        router.push('/login');
      } else if (user.user_metadata.role === 'admin' || user.user_metadata.role === 'super_admin') {
        // Es admin, permitir acceso
        setIsAuthorized(true);
      } else {
        // No tiene permisos, redirigir al home
        setIsAuthorized(false);
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || isAuthorized === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthorized === false) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1">
          No tienes permisos para acceder a esta sección. Serás redirigido al inicio.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Dashboard />
    </Container>
  );
} 