'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme.config';
import RegisterEmotion from './register-emotion';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado para controlar el renderizado en el cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Esto solo se ejecuta en el cliente
    setIsMounted(true);
    
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newThemeState = !isDarkMode;
    setIsDarkMode(newThemeState);
    localStorage.setItem('theme', newThemeState ? 'dark' : 'light');
  };

  // Durante el SSR o el primer renderizado del cliente, devolvemos un tema por defecto
  if (!isMounted) {
    return (
      <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme }}>
        <RegisterEmotion>
          <MUIThemeProvider theme={lightTheme}>
            {children}
          </MUIThemeProvider>
        </RegisterEmotion>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <RegisterEmotion>
        <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          {children}
        </MUIThemeProvider>
      </RegisterEmotion>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}; 