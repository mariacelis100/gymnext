'use client'

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Paper, 
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import CustomerManagement from './customer-management.component';
import TrainerManagement from './trainer-management.component';

// Componente personalizado para el indicador de tendencia
const TrendIndicator = ({ value, asPercentage = true }: { value: number, asPercentage?: boolean }) => {
  const isPositive = value >= 0;
  return (
    <Box 
      component="span" 
      sx={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        color: isPositive ? 'success.main' : 'error.main',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        ml: 1
      }}
    >
      {isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
      {isPositive ? '+' : ''}{asPercentage ? `${value}%` : value}
    </Box>
  );
};

// Tarjeta personalizada para métricas
const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#2A3544' : '#FFFFFF',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

// Tipo para la actividad reciente
interface Activity {
  id: number;
  type: 'check-in' | 'payment' | 'new-member' | 'membership-end';
  userName: string;
  timestamp: string;
  details?: string;
}

// Tipo para la métrica del dashboard
interface Metric {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const theme = useTheme();
  
  useEffect(() => {
    // Datos de ejemplo para las métricas
    const mockMetrics: Metric[] = [
      {
        title: 'Miembros Totales',
        value: 342,
        trend: 5.2,
        icon: <GroupIcon />,
        color: '#3f51b5',
        description: 'Total de miembros registrados'
      },
      {
        title: 'Ingresos Hoy',
        value: 45,
        trend: 12.7,
        icon: <CheckCircleIcon />,
        color: '#4caf50',
        description: 'Miembros que ingresaron hoy'
      },
      {
        title: 'Membresías Activas',
        value: 287,
        trend: -2.3,
        icon: <FitnessCenterIcon />,
        color: '#f44336',
        description: 'Membresías activas actualmente'
      },
      {
        title: 'Ingresos Mensuales',
        value: '$8,245',
        trend: 8.1,
        icon: <AttachMoneyIcon />,
        color: '#ff9800',
        description: 'Ingresos del mes actual'
      }
    ];
    
    // Datos de ejemplo para la actividad reciente
    const mockActivity: Activity[] = [
      {
        id: 1,
        type: 'check-in',
        userName: 'María Rodríguez',
        timestamp: '2023-06-15 09:45:00',
        details: 'Check-in en recepción'
      },
      {
        id: 2,
        type: 'payment',
        userName: 'Juan Pérez',
        timestamp: '2023-06-15 09:30:00',
        details: 'Renovación de membresía - $45.00'
      },
      {
        id: 3,
        type: 'new-member',
        userName: 'Carlos López',
        timestamp: '2023-06-15 08:15:00',
        details: 'Membresía Premium - 3 meses'
      },
      {
        id: 4,
        type: 'membership-end',
        userName: 'Ana Martínez',
        timestamp: '2023-06-15 08:00:00',
        details: 'Membresía expira en 3 días'
      },
      {
        id: 5,
        type: 'check-in',
        userName: 'Pedro Ramírez',
        timestamp: '2023-06-15 07:30:00',
        details: 'Check-in con entrenador'
      }
    ];
    
    setMetrics(mockMetrics);
    setRecentActivity(mockActivity);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return <CheckCircleIcon color="success" />;
      case 'payment':
        return <ReceiptIcon color="primary" />;
      case 'new-member':
        return <PersonAddIcon color="info" />;
      case 'membership-end':
        return <CalendarTodayIcon color="warning" />;
      default:
        return <FitnessCenterIcon />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#666666' }}>
        Gestión de Administrador
      </Typography>
      
      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 1, fontWeight: 'bold', color: '#666666' }}>
                      {metric.value}
                      {metric.trend !== undefined && (
                        <TrendIndicator value={metric.trend} />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.description}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      bgcolor: `${metric.color}20`,
                      color: metric.color,
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Actividad reciente y menú de navegación */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Actividad reciente */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#666666' }}>Actividad Reciente</Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {recentActivity.map((activity) => (
                  <ListItem 
                    key={activity.id}
                    sx={{ 
                      px: 1, 
                      py: 0.5,
                      borderLeft: `3px solid ${
                        activity.type === 'check-in' ? 'success.main' :
                        activity.type === 'payment' ? 'primary.main' :
                        activity.type === 'new-member' ? 'info.main' : 
                        'warning.main'
                      }`,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.userName}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {formatTimestamp(activity.timestamp)} - 
                          </Typography>
                          {' '}{activity.details}
                        </React.Fragment>
                      }
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium', sx: { color: '#666666' } }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  size="small" 
                  color="primary"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 'medium',
                    color: theme.palette.primary.main
                  }}
                >
                  Ver todas las actividades
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Menú de navegación rápida */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1A1D23' : '#FFFFFF',
              overflow: 'hidden', 
              p: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { 
                    color: theme.palette.mode === 'dark' ? '#E8E9EA' : '#666',
                    py: 2,
                    '&.Mui-selected': { 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#00B7FF',
                      fontWeight: 'bold' 
                    }
                  }
                }}
              >
                <Tab label="Gestión de Clientes" />
                <Tab label="Gestión de Entrenadores" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
              {tabValue === 0 && <CustomerManagement />}
              {tabValue === 1 && <TrainerManagement />}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 