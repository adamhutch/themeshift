import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/ui/**/*.tsx'],
        exclude: ['src/ui/**/*.test.tsx'],
        thresholds: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
    },
  })
);
