import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/expenses": "http://localhost:4000",
      "/convert": "http://localhost:4000",
    },
  },
});
