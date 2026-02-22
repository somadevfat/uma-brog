import mdx from '@mdx-js/rollup'
import honox from 'honox/vite'
import { defineConfig } from 'vitest/config'

/**
 * Vitest の詳細設定。
 * HonoX プロジェクトのテスト環境、カバレッジ閾値、MDX サポートなどを定義します。
 */
export default defineConfig({
  // Vite プラグインの設定
  plugins: [
    honox({
      devServer: { adapter: () => ({}) },
    }),
    mdx({
      jsxImportSource: 'hono/jsx',
    }),
  ],
  // テストランナーの設定
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    // カバレッジ計測の設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 各項目の閾値を 80% に設定
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
