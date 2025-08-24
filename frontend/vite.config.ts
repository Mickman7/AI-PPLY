import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite'; // Make sure this matches the package

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    host: true, // Makes it accessible from Docker
    port: 3000,
  },
});
