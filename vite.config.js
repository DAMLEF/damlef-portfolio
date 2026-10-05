import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the portfolio.
// - React plugin for JSX / Fast Refresh
// - Server open on start
// - Assets under /public are served from the site root
export default defineConfig({
  plugins: [react()],
  base: "/damlef-portfolio",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
