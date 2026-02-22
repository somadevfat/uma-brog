import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
import { type Handler, Hono } from 'hono'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrizzleDB } from '../../../../src/db/client'
import { contactService } from '../../../../src/features/contact/services'
import * as adminModule from '../index'

// contactService のモック化
vi.mock('../../../../src/features/contact/services', () => ({
  contactService: {
    getAllMessages: vi.fn(),
  },
}))

// drizzle-orm/d1 のモック化
vi.mock('drizzle-orm/d1', () => ({
  drizzle: vi.fn(),
}))

/**
 * テスト用の共通 Env 型定義。
 */
type TestEnv = {
  // biome-ignore lint/style/useNamingConvention: Hono standard
  Bindings: { DB: D1Database }
  // biome-ignore lint/style/useNamingConvention: Hono standard
  Variables: { db: DrizzleDB }
}

/**
 * 管理画面のルーティングテスト。
 */
describe('Admin Routes (Manual App)', () => {
  const createTestApp = () => {
    const app = new Hono<TestEnv>()

    // ミドルウェア（DB初期化）
    app.use('*', async (c, next) => {
      const db = c.env?.DB
      if (db) {
        c.set('db', drizzle(db) as unknown as DrizzleDB)
      }
      await next()
    })

    const handlers = adminModule.default as unknown as [
      Handler<TestEnv, '/admin'>,
      ...Handler<TestEnv, '/admin'>[],
    ]
    app.get('/admin', ...handlers)

    // c.render のモック化
    app.use('*', async (c, next) => {
      c.render = vi.fn().mockImplementation((_jsx: unknown, props: { title?: string }) => {
        return c.html(`RENDERED: ${props.title || 'ADMIN'}`)
      })
      await next()
    })

    return app
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /admin', () => {
    it('正常系：DBが利用可能でメッセージがある場合、200を返しダッシュボードが表示されること', async () => {
      // ## Arrange ##
      const mockMessages = [
        {
          id: '1',
          senderName: 'Test User',
          senderEmail: 'test@example.com',
          subject: 'Sub',
          body: 'Body',
          createdAt: new Date(),
        },
      ]
      vi.mocked(contactService.getAllMessages).mockResolvedValue(
        mockMessages as unknown as Awaited<ReturnType<typeof contactService.getAllMessages>>
      )

      const mockDb = { select: vi.fn() } as unknown as DrizzleDB
      // biome-ignore lint/suspicious/noExplicitAny: <mocking drizzle-orm internal>
      vi.mocked(drizzle).mockReturnValue(mockDb as any)

      const app = createTestApp()
      const mockD1 = { prepare: vi.fn() } as unknown as D1Database

      // ## Act ##
      const res = await app.request(
        '/admin',
        {},
        {
          // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
          DB: mockD1,
        }
      )

      // ## Assert ##
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).toContain('STRATEGIC_MANAGEMENT_CONSOLE')
      expect(text).toContain('Test User')
      expect(contactService.getAllMessages).toHaveBeenCalled()
    })

    it('異常系：DBが利用可能だがメッセージがない場合、正当なメッセージが表示されること', async () => {
      // ## Arrange ##
      vi.mocked(contactService.getAllMessages).mockResolvedValue([])

      const mockDb = { select: vi.fn() } as unknown as DrizzleDB
      // biome-ignore lint/suspicious/noExplicitAny: <mocking drizzle-orm internal>
      vi.mocked(drizzle).mockReturnValue(mockDb as any)

      const app = createTestApp()
      const mockD1 = { prepare: vi.fn() } as unknown as D1Database

      // ## Act ##
      const res = await app.request(
        '/admin',
        {},
        {
          // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
          DB: mockD1,
        }
      )

      // ## Assert ##
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).toContain('NO_SIGNALS_RECEIVED_IN_CURRENT_BUFFER')
    })

    it('異常系：DBが利用不可能な場合に 404 を返すこと', async () => {
      // ## Arrange ##
      const app = createTestApp()

      // ## Act ##
      const res = await app.request('/admin')

      // ## Assert ##
      expect(res.status).toBe(404)
    })
  })
})
