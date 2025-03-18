'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme.config';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Creamos un cache de emociones para el lado del cliente
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado para controlar el renderizado en el cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Esto solo se ejecuta en el cliente
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Creamos el cache del cliente solo en el lado del cliente
  const emotionCache = createEmotionCache();

  // Durante el SSR o el primer renderizado del cliente, no renderizamos nada
  // excepto una estructura básica para prevenir problemas de hidratación
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <CacheProvider value={emotionCache}>
        <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          {children}
        </MUIThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}; 