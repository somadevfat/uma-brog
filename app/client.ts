import { createClient } from 'honox/client'

/**
 * HonoX クライアントサイドのエントリポイント。
 * アイランドのハイドレーションを初期化します。
 * VITE_MSW=true の場合は MSW を起動してから Islands を初期化します。
 */

// MSW のセットアップ（E2E テスト時のみ）
// NOTE: トップレベル await で処理をブロックすると HonoX の Islands ハイドレーションが止まるため、
// MSWの起動は非同期とし、createClient() 自体は同期的に呼び出す。
if (import.meta.env.VITE_MSW === 'true') {
  import('./mocks/browser').then(({ startMockWorker }) => {
    startMockWorker()
  })
}

// Islands のハイドレーションを即時実行
createClient()
