import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (Agarantche.github.io) is served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
