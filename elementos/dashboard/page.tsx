'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, CircularProgress, Grid, Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomerManagement from '@/features/admin/components/customer-management.component';
import TrainerManagement from '@/features/admin/components/trainer-management.component';
import Dashboard from '@/features/admin/components/dashboard.component';
import MemberRegistration from '@/features/admin/components/member-registration.component';
import { useAuth } from '@/core/auth/auth-context';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    if (!loading && (!user || (user.user_metadata.role !== 'admin' && user.user_metadata.role !== 'super_admin'))) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setShowRegistrationForm(false);
  };

  const handleShowRegistrationForm = () => {
    setShowRegistrationForm(true);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h6" color="error">
            No tienes permiso para acceder a esta página
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#666666' }}>
          Dashboard de Administración
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666666' }}>
          Bienvenido, {user.user_metadata.name} {user.user_metadata.lastName}
        </Typography>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{
          mb: 3, 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: '#666666',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          }
        }}
      >
        <Tab label="Resumen" />
        <Tab label="Gestión de Clientes" />
        <Tab label="Gestión de Entrenadores" />
        <Tab label="Registro de Miembros" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <Dashboard />}
        {activeTab === 1 && <CustomerManagement />}
        {activeTab === 2 && <TrainerManagement />}
        {activeTab === 3 && (
          <Box>
            {showRegistrationForm ? (
              <MemberRegistration />
            ) : (
              <>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#666666' }}>
                  Registro de Nuevos Miembros
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#666666' }}>
                  En esta sección podrás registrar nuevos miembros en el sistema, 
                  ya sean clientes, entrenadores o administradores.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleShowRegistrationForm}
                >
                  Nuevo Registro
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
} 