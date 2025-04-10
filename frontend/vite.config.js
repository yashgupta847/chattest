import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // you can change this
  },
  build: {
    rollupOptions: {
      external: ['react-icons/fa'],
    },
  },
});
