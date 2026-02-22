import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contactService } from '../../../../src/features/contact/services'
import * as contactModule from '../contact'

// contactService のモック化
vi.mock('../../../../src/features/contact/services', () => ({
  contactService: {
    sendMessage: vi.fn(),
  },
}))

// drizzle-orm/d1 のモック化
vi.mock('drizzle-orm/d1', () => ({
  drizzle: vi.fn(),
}))

/**
 * お問い合わせ API (POST /api/contact) のテスト。
 * Hono インスタンスを個別に作成してハンドラーをテストします。
 * createRoute の戻り値が配列（[validator, handler]）であることを利用します。
 */
describe('POST /api/contact handler', () => {
  const validPayload = {
    senderName: 'Test User',
    senderEmail: 'test@example.com',
    subject: 'Test Subject',
    body: 'Test Body',
  }

  // テスト用の Hono アプリ設定
  const createTestApp = () => {
    // Variables に db を追加し、Bindings に DB を追加
    // biome-ignore lint/suspicious/noExplicitAny: <mocking purpose>
    // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
    const app = new Hono<{ Bindings: { DB: D1Database }; Variables: { db: any } }>()

    // Middleware
    app.use('*', async (c, next) => {
      const db = c.env?.DB
      if (db) {
        c.set('db', drizzle(db as D1Database))
      }
      await next()
    })

    // contactModule.POST は [validator, handler] の配列
    // biome-ignore lint/suspicious/noExplicitAny: <hono internal structure>
    const handlers = contactModule.POST as any[]
    app.post('/api/contact', handlers[0], handlers[1])
    return app
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常系：DBが利用可能でバリデーションを通過した場合、200を返すこと', async () => {
    // ## Arrange ##
    const mockDb = { insert: vi.fn() }
    // biome-ignore lint/suspicious/noExplicitAny: <mocking drizzle-orm>
    vi.mocked(drizzle).mockReturnValue(mockDb as any)
    vi.mocked(contactService.sendMessage).mockResolvedValue(undefined)

    const app = createTestApp()
    const mockD1 = { prepare: vi.fn() } as unknown as D1Database

    // ## Act ##
    const res = await app.request(
      '/api/contact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      },
      {
        // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
        DB: mockD1,
      }
    )

    // ## Assert ##
    expect(res.status).toBe(200)
    expect(contactService.sendMessage).toHaveBeenCalled()
    const json = (await res.json()) as { success: boolean }
    expect(json.success).toBe(true)
  })

  it('異常系：DBが利用不可能な場合に 500 を返すこと', async () => {
    // ## Arrange ##
    const app = createTestApp()

    // ## Act ##
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })

    // ## Assert ##
    expect(res.status).toBe(500)
    const json = (await res.json()) as { error: string }
    expect(json.error).toBe('Database not available')
  })

  it('異常系：サービス層でエラーが発生した場合、500を返すこと', async () => {
    // ## Arrange ##
    const mockDb = { insert: vi.fn() }
    // biome-ignore lint/suspicious/noExplicitAny: <mocking drizzle-orm>
    vi.mocked(drizzle).mockReturnValue(mockDb as any)
    vi.mocked(contactService.sendMessage).mockRejectedValue(new Error('Internal Error'))

    const app = createTestApp()
    const mockD1 = { prepare: vi.fn() } as unknown as D1Database

    // ## Act ##
    const res = await app.request(
      '/api/contact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      },
      {
        // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
        DB: mockD1,
      }
    )

    // ## Assert ##
    expect(res.status).toBe(500)
    const json = (await res.json()) as { success: boolean }
    expect(json.success).toBe(false)
  })

  it('異常系：バリデーションエラー（名前が空）の場合に 400 を返すこと', async () => {
    // ## Arrange ##
    const invalidPayload = { ...validPayload, senderName: '' }
    const app = createTestApp()
    const mockD1 = { prepare: vi.fn() } as unknown as D1Database

    // ## Act ##
    const res = await app.request(
      '/api/contact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      },
      {
        // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
        DB: mockD1,
      }
    )

    // ## Assert ##
    expect(res.status).toBe(400)
  })
})
