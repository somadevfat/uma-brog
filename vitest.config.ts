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
    // カバレッジ計測の設定（対象は .ts のみ）
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'app/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.tsx', // ページ・UIコンポーネントは Playwright でテストするため除外
        'app/client.ts',
        '**/*.d.ts',
        '**/types.ts',
      ],
      // 各項目の閾値を 100% に設定
      /*
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      */
    },
  },
})
