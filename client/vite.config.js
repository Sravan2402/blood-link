import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Accept the sandbox/preview hostnames (dynamic per session), not just
    // localhost, so the live preview can load.
    allowedHosts: true,
    proxy: {
      // Proxy API calls to the Express backend so the frontend can use
      // relative "/api" URLs in both dev and the live preview.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
