'use client'

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useAuth } from '@/core/hooks/use-mock-auth';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  return (
    <Box sx={{ 
      width: expanded ? 240 : 65, 
      transition: 'width 0.3s ease',
      bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#1A2642',
      borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#2A3544' : '#2A3544'}`,
      color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
      height: '100vh',
      position: 'sticky',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: expanded ? 'space-between' : 'center' }}>
        {expanded && (
          <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Orbitron, sans-serif' }}>
            COSMOS GYM
          </Box>
        )}
        <IconButton onClick={handleToggle} color="inherit">
          <MenuIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ bgcolor: theme.palette.mode === 'dark' ? '#2A3544' : '#2A3544' }} />
      
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <PersonAddIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Registro de Usuarios" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <PeopleIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Gestión de Clientes" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <FitnessCenterIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Gestión de Entrenadores" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <NewspaperIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Gestión de Noticias" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Configuración" />}
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ bgcolor: theme.palette.mode === 'dark' ? '#2A3544' : '#2A3544' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              minHeight: 48,
              justifyContent: expanded ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {expanded && <ListItemText primary="Cerrar Sesión" />}
          </ListItemButton>
        </ListItem>
      </List>
      
      {expanded && user && (
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#2A3544' : '#2A3544'}`
        }}>
          <Box component="div" sx={{ 
            fontWeight: 'bold', 
            fontSize: '0.9rem', 
            textAlign: 'center' 
          }}>
            {user.user_metadata.name} {user.user_metadata.lastName}
          </Box>
          <Box component="div" sx={{ 
            fontSize: '0.8rem', 
            color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#00B7FF',
            textAlign: 'center'
          }}>
            {user.user_metadata.role === 'super_admin' ? 'Super Administrador' : 'Administrador'}
          </Box>
        </Box>
      )}
    </Box>
  );
} 