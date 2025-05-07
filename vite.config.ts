import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AstroQuiz/',
  server: {
    host: true, // Listen on all local IPs
    port: 5173, // Default Vite port
  },
})
