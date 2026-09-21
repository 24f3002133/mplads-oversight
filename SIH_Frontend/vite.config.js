import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The four seed images are ~2-3 MB each; never inline them.
    assetsInlineLimit: 4096,
  },
});
