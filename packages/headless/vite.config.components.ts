import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        'components/Chip/index': fileURLToPath(
          new URL('./src/entrypoints/components/Chip.ts', import.meta.url)
        ),
        'components/FilterChip/index': fileURLToPath(
          new URL('./src/entrypoints/components/FilterChip.ts', import.meta.url)
        ),
        'components/Menu/index': fileURLToPath(
          new URL('./src/entrypoints/components/Menu.ts', import.meta.url)
        ),
        'components/Tabs/index': fileURLToPath(
          new URL('./src/entrypoints/components/Tabs.ts', import.meta.url)
        ),
        'components/Tooltip/index': fileURLToPath(
          new URL('./src/entrypoints/components/Tooltip.ts', import.meta.url)
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
