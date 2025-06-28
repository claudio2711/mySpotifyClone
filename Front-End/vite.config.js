import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// niente @tailwindcss/vite: con Tailwind 3 non serve
export default defineConfig({
  plugins: [
    react(),
  ],
});
