import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <style>
      {`
          :root {
            --primary-color: ${theme.palette.primary.main};
            --secondary-color: ${theme.palette.secondary.main};
            --grey-500: ${theme.palette.grey[500]};
            --grey-800: ${theme.palette.grey[800]};
            --grey-200: ${theme.palette.grey[200]};
            --grey-100: ${theme.palette.grey[100]};
            --grey-300: ${theme.palette.grey[300]};
          }
        `}
    </style>

    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
