'use client'

import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useAuth } from '@/core/auth/auth-context';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/features/admin/components/admin-sidebar.component';
import AdminHeader from '@/features/admin/components/admin-header.component';
import UserRegistrationForm from '@/features/admin/components/user-registration-form.component';
import CustomerManagement from '@/features/admin/components/customer-management.component';
import TrainerManagement from '@/features/admin/components/trainer-management.component';
import NewsManagement from '@/features/admin/components/news-management.component';
import StatusManagement from '@/features/admin/components/status-management.component';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { user, loading } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  
  // Verificar permisos de administrador
  useEffect(() => {
    if (!loading && user) {
      const userRole = user.user_metadata?.role;
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        router.push('/welcome');
      }
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Cargando...</Typography>
      </Box>
    );
  }
  
  // Si no hay usuario o no es administrador, no mostrar contenido
  if (!user || (user.user_metadata?.role !== 'admin' && user.user_metadata?.role !== 'super_admin')) {
    return null;
  }
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' ? '#0A0C10' : '#0A1A3F',
      color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF'
    }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <AdminHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#2A3544' : '#1A2642',
            color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF'
          }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard de Administración
            </Typography>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ 
                mb: 3,
                '& .MuiTab-root': { 
                  color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
                  opacity: 0.7,
                  '&.Mui-selected': { 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#00B7FF', 
                    opacity: 1,
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <Tab label="Registro de Usuario" />
              <Tab label="Gestión de Clientes" />
              <Tab label="Gestión de Entrenadores" />
              <Tab label="Gestión de Noticias" />
              <Tab label="Gestión de Estados" />
            </Tabs>
            
            {activeTab === 0 && <UserRegistrationForm />}
            {activeTab === 1 && <CustomerManagement />}
            {activeTab === 2 && <TrainerManagement />}
            {activeTab === 3 && <NewsManagement />}
            {activeTab === 4 && <StatusManagement />}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
} 