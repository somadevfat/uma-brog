import { defineConfig } from 'vitest/config'
import honox from 'honox/vite'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter: () => ({}) } 
    }),
    mdx({
      jsxImportSource: 'hono/jsx',
    })
  ],
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      }
    }
  }
})
