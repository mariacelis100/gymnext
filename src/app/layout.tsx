import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/core/auth/auth-context';
import { ThemeProvider } from '@/core/theme/theme-context';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'COSMOS GYM',
  description: 'Fitness • Musculación • Cardio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
