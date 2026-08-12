import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three e cannon são grandes e mudam pouco: valem um chunk próprio,
        // que fica em cache entre deploys.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/cannon-es')) return 'physics';
          return undefined;
        },
      },
    },
  },
  test: {
    globals: true,
    // Padrão node: o motor não toca no DOM e roda mais rápido assim.
    // Os testes que precisam de DOM declaram `@vitest-environment jsdom`
    // no topo do arquivo.
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
