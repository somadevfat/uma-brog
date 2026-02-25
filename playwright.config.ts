import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright の設定ファイル。
 * E2E テストは `e2e/` ディレクトリに配置し、webServer で開発サーバーを自動起動する。
 * - ページ（.tsx ルート）のUI テストを担当
 * - Vitest はロジック(.ts)のユニットテストを担当（役割分担）
 */
export default defineConfig({
  /** 全体を対象とし、拡張子で E2E テストと識別 */
  testDir: './',
  testMatch: '**/*.spec.ts',
  /** すべてのテストを並列実行 */
  fullyParallel: true,
  /** CI で test.only が残っていたらビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /** CI のみリトライ（フレーキー対策） */
  retries: process.env.CI ? 2 : 0,
  /** CI では並列数を制限 */
  workers: process.env.CI ? 1 : undefined,
  /** レポーター: ローカルは html、CI は github 向け */
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    /** テスト対象の Base URL */
    baseURL: 'http://localhost:5173',
    /** 失敗時の最初のリトライでトレースを収集 */
    trace: 'on-first-retry',
    /** 失敗時のみスクリーンショットを保存 */
    screenshot: 'only-on-failure',
  },
  projects: [
    /**
     * PC・モバイル両方のビューポート切り替えはテストコード側（test.use）で制御するため、
     * プロジェクトは chromium（PC）1種類のみで起動し、ムダな実行や skip を防ぐ。
     */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /**
   * テスト実行前に開発サーバーを自動起動する。
   * VITE_MSW=true で MSW が有効になり、API リクエストがモックされる。
   * CI では既存サーバーを再利用しない。
   */
  webServer: {
    command: 'VITE_MSW=true bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
