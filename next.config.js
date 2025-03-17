/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Configuramos correctamente el modo de transpilación de módulos
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    '@emotion/cache',
  ],
  // Desactivamos la compresión temporal mientras debugueamos
  compress: false,
  // Configuración para asegurar compatibilidad con Material UI en SSR
  compiler: {
    emotion: true,
  },
};

module.exports = nextConfig; 