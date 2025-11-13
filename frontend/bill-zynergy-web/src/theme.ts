import { createTheme } from '@mui/material/styles';
import { light } from '@mui/material/styles/createPalette';

const theme = createTheme({
  palette: {
    primary: {
      main: '#135e9b',
      light: '#85b4e1'
    },
    secondary: {
      main: '#ffffff',
    },
    grey: {
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      500: "#6b7280",
      600: "#4b5563",
      800: "#1f2933",
      900: "#111827"
    },
    green: {
      main: "#22c55e",
      light: "#bbf7d0",
      dark: "#166534",
      contrastText: "#ffffff",
    },
    red: {
      main: "#ef4444",
      light: "#fee2e2"
    }
  },
});

export default theme;
