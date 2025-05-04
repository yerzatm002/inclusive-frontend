// src/styles/themes.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#fdfdfd' },
    primary: { main: '#4caf50' },
    secondary: { main: '#ffb300' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212' },
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
});
