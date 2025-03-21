'use client'

import ProtectedRoute from '@/core/auth/protected-route.component'
import { useAuth } from '@/core/auth/auth-context'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container, Card, CardContent, Grid } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AppBar position="static" sx={{ bgcolor: '#0A1A3F' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              COSMOS GYM - Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#00B7FF' }}>
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0A1A3F', fontWeight: 'bold' }}>
            Bienvenido, {user?.name || 'Usuario'}
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#0A1A3F', fontWeight: 'bold' }}>
                    Información Personal
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {user?.name || 'No disponible'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Apellido:</strong> {user?.lastName || 'No disponible'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Teléfono:</strong> {user?.phone || 'No disponible'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Documento:</strong> {user?.identityNumber || 'No disponible'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#0A1A3F', fontWeight: 'bold' }}>
                    Estado de Membresía
                  </Typography>
                  <Box sx={{ mt: 2, p: 3, bgcolor: '#E8F5E9', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                      Activa
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Tu membresía expira en: <strong>30 días</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ProtectedRoute>
  )
} 