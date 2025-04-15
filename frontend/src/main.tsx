import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './styles/theme'
import App from './App'
import './styles/global.css'

// Desativar o StrictMode em produção para melhorar o desempenho
const StrictModeWrapper = process.env.NODE_ENV === 'development'
  ? React.StrictMode
  : React.Fragment;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictModeWrapper>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictModeWrapper>,
)
