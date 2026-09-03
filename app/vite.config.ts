import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built app can be hosted from any static path
// (GitHub Pages project sites, S3 prefixes, etc.).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
