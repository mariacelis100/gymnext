import { createTheme } from '@mui/material/styles';

// Definimos colores principales del logo y marca
const brandColors = {
  // Color azul principal del logo (azul marino)
  primaryBlue: '#0043A4',  // Ajustado según el logo mostrado
  // Color de fondo azul oscuro
  darkBlue: '#0A1A3F',
  // Color acento cyan
  accentCyan: '#00B7FF',
  // Blanco
  white: '#FFFFFF',
  // Negro rico
  richBlack: '#0A0C10',
  // Acero oscuro
  darkSteel: '#2A3544',
  // Gris plateado claro
  silverGray: '#E8E9EA',
};

// Definimos los temas basados en el archivo .context y la imagen de referencia
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primaryBlue, // Azul del logo como color principal
      contrastText: brandColors.white,
    },
    secondary: {
      main: brandColors.accentCyan, // Cyan como color secundario
      contrastText: brandColors.white,
    },
    background: {
      default: brandColors.darkBlue, // Azul marino profundo
      paper: '#1a2a4f',   // Un poco más claro que el fondo
    },
    text: {
      primary: brandColors.white,
      secondary: brandColors.accentCyan, // Azul más claro para el texto secundario
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    body1: {
      letterSpacing: '0.03em',
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2642',
          color: brandColors.white,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'uppercase',
          fontWeight: 600,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brandColors.primaryBlue, // Mismo azul del logo para coherencia
      contrastText: brandColors.silverGray,
    },
    secondary: {
      main: brandColors.accentCyan, // Cyan como color secundario
      contrastText: brandColors.silverGray,
    },
    background: {
      default: brandColors.richBlack, // Negro rico
      paper: '#1A1D23',   // Un poco más claro que el fondo
    },
    text: {
      primary: brandColors.silverGray, // Gris plateado claro
      secondary: brandColors.accentCyan, // Azul más claro para el texto secundario
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    body1: {
      letterSpacing: '0.03em',
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1D23',
          color: brandColors.white,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'uppercase',
          fontWeight: 600,
        },
      },
    },
  },
}); 