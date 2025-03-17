'use client';

import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@/core/theme/theme-context';
import dynamic from 'next/dynamic';

// Usamos dynamic import con ssr: false para evitar problemas de hidratación
// para componentes que pueden tener código específico del cliente
const DynamicNavBar = dynamic(
  () => import('@/features/home/components/nav-bar.component').then(mod => ({ default: mod.NavBar })), 
  { ssr: false }
);

// Nuevo componente de banner con la imagen correctamente centrada
const DynamicHeroBanner = dynamic(
  () => import('@/features/home/components/hero-banner.component').then(mod => ({ default: mod.HeroBanner })),
  { ssr: false }
);

const DynamicPromoBanner = dynamic(
  () => import('@/features/home/components/promo-banner.component').then(mod => ({ default: mod.PromoBanner })),
  { ssr: false }
);

const DynamicFeatureCards = dynamic(
  () => import('@/features/home/components/feature-cards.component').then(mod => ({ default: mod.FeatureCards })),
  { ssr: false }
);

export default function Home() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Barra de navegación */}
        <DynamicNavBar />

        {/* Banner principal - Reemplazado con el nuevo Hero Banner */}
        <DynamicHeroBanner />

        {/* Banner promocional */}
        <Box sx={{ px: { xs: 2, md: 4 }, mb: 4 }}>
          <DynamicPromoBanner />
        </Box>

        {/* Tarjetas de características */}
        <Box sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <DynamicFeatureCards />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
