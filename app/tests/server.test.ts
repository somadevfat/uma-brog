import { describe, expect, it, vi } from 'vitest'
import app from '../server'

/**
 * app/server.ts のテスト。
 * ミドルウェア（DB初期化など）の動作を検証します。
 */
describe('Server middleware', () => {
  it('c.env.DB がある場合、c.var.db に Drizzle インスタンスがセットされること', async () => {
    // ## Arrange ##
    const mockD1 = {
      prepare: vi.fn(),
    }

    // ## Act ##
    // 任意のルートに対してリクエストを送り、DBがセットされるか確認。
    // そのために、DBを確認するためのテスト用エンドポイントを動的に追加。
    // _middleware.ts からミドルウェアをインポートして適用
    const { middleware } = await import('../routes/_middleware')
    app.use('/test-db-middleware', middleware)

    app.get('/test-db-middleware', (c) => {
      const db = c.get('db')
      return c.json({ hasDb: !!db })
    })

    const res = await app.request(
      '/test-db-middleware',
      {},
      {
        // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
        DB: mockD1,
      }
    )

    // ## Assert ##
    expect(res.status).toBe(200)
    const json = (await res.json()) as { hasDb: boolean }
    expect(json.hasDb).toBe(true)
  })

  it('c.env.DB がない場合、c.var.db には何もセットされないこと', async () => {
    // ## Arrange ##
    // Env なし

    // ## Act ##
    // 先ほど追加したテスト用エンドポイントを再利用
    const res = await app.request('/test-db-middleware')

    // ## Assert ##
    expect(res.status).toBe(200)
    const json = (await res.json()) as { hasDb: boolean }
    expect(json.hasDb).toBe(false)
  })
})
