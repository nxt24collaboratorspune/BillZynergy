import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#135e9b',
    },
    secondary: {
      main: '#ffffff',
    },
    grey: {
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      500: "#6b7280",
      800: "#1f2933",
      900: "#111827"
    },
    green: {
      main: "#22c55e",
      light: "#86efac",
      dark: "#15803d",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
