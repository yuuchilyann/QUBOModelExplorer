import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2b6cb0' },
    secondary: { main: '#7c5cbf' },
    success: { main: '#2f855a' },
    warning: { main: '#c05621' },
    error: { main: '#c53030' },
    background: { default: '#f7f8fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily:
      '"Roboto", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif',
    h1: { fontSize: '1.6rem', fontWeight: 600 },
    h2: { fontSize: '1.3rem', fontWeight: 600 },
    h3: { fontSize: '1.1rem', fontWeight: 600 },
    body2: { lineHeight: 1.75 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});

/** Categorical colours for graph colouring / set membership. Kept accessible in both roles. */
export const CATEGORY_COLORS = [
  '#2b6cb0',
  '#c05621',
  '#2f855a',
  '#7c5cbf',
  '#b7791f',
  '#2c7a7b',
  '#b83280',
  '#4a5568',
];
