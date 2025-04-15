import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: false, // Desabilita completamente o PostCSS
  },
  server: {
    hmr: {
      overlay: false // Desabilitar overlay de erro
    }
  }
})
