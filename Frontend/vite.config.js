import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Prevent Vite from crawling the Backend directory
    fs: {
      allow: ['..'], // allow parent folder (root) but not its subfolders
      strict: true,
    },
  },
  build: {
    // Exclude Backend from the bundle
    rollupOptions: {
      external: [/^\.\.\/Backend/],
    },
    // Reduce memory usage during build
    chunkSizeWarningLimit: 500,
  },
});
