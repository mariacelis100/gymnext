'use client'

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Tooltip, Avatar, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '@/core/auth/auth-context';
import { useTheme as useAppTheme } from '@/core/theme/theme-context';

export default function AdminHeader() {
  const { user } = useAuth();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#1A2642',
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2A3544' : '#2A3544'}`,
        color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#FFFFFF',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 'bold'
          }}
        >
          <Box component="span" sx={{ color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#00B7FF' }}>
            Admin
          </Box>
          <Box component="span" sx={{ ml: 1 }}>Panel</Box>
        </Typography>

        <Tooltip title="Cambiar tema">
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mx: 1 }}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notificaciones">
          <IconButton color="inherit" sx={{ mx: 1 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {user && (
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt={`${user.user_metadata.name} ${user.user_metadata.lastName}`}
              src="/avatars/male/avatar1.png"
              sx={{ 
                width: 36, 
                height: 36,
                border: `2px solid ${theme.palette.mode === 'dark' ? '#2A3544' : '#00B7FF'}` 
              }}
            />
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {user.user_metadata.name}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#00B7FF',
                fontSize: '0.7rem'
              }}>
                {user.user_metadata.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </Typography>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
} 