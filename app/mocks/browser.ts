import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW ブラウザ用ワーカーのセットアップ。
 * E2E テスト時（VITE_MSW=true）にのみ起動する。
 */
export async function startMockWorker() {
  // Service Worker を起動してリクエストをインターセプト
  const worker = setupWorker(...handlers)
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
