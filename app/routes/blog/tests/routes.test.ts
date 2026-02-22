import type { D1Database } from '@cloudflare/workers-types'
import { type Handler, Hono, type MiddlewareHandler } from 'hono'
import type { FC } from 'hono/jsx'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrizzleDB } from '../../../../src/db/client'
import * as blogRoute from '../[slug]'
import * as blogIndex from '../index'

/**
 * テスト用の共通 Env 型定義。
 */
type TestEnv = {
  // biome-ignore lint/style/useNamingConvention: Hono standard
  Bindings: { DB: D1Database }
  // biome-ignore lint/style/useNamingConvention: Hono standard
  Variables: { db: DrizzleDB }
}

// blogService のモック化
vi.mock('../../../../src/features/blog/services', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../src/features/blog/services')>()
  return {
    blogService: {
      ...actual.blogService,
      getAllPosts: vi.fn(),
    },
  }
})

import { blogService } from '../../../../src/features/blog/services'

/**
 * ブログページのルーティングテスト。
 */
describe('Blog Routes (Manual App)', () => {
  const createTestApp = () => {
    return new Hono<TestEnv>()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /blog', () => {
    it('正常系：記事がある場合、200 ステータスを返し、記事一覧が表示されること', async () => {
      const app = createTestApp()
      // 少なくとも1つの要素を持つタプルとしてキャストし、Hono のオーバーロードを満たす
      const handlers = blogIndex.default as unknown as [
        Handler<TestEnv, '/blog'>,
        ...Handler<TestEnv, '/blog'>[],
      ]
      app.get('/blog', ...handlers)

      const mockPosts = [
        {
          slug: 'test-slug',
          title: 'Test Title',
          excerpt: 'Test Excerpt',
          date: '2026-01-01',
          category: 'SYS' as const,
          content: (() => null) as FC,
        },
      ]
      vi.mocked(blogService.getAllPosts).mockResolvedValue(mockPosts)

      const res = await app.request('/blog')
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).toContain('SYSTEM_LOGS')
      expect(text).toContain('Test Title')
    })
  })

  describe('GET /blog/:slug', () => {
    it('存在する記事にアクセスし、DBが利用可能な場合に閲覧数がインクリメントされること', async () => {
      const app = createTestApp()
      const { middleware } = await import('../../_middleware')
      app.use('/blog/:slug', middleware as unknown as MiddlewareHandler<TestEnv>)

      // 同様にタプル型でキャスト
      const handlers = blogRoute.default as unknown as [
        Handler<TestEnv, '/blog/:slug'>,
        ...Handler<TestEnv, '/blog/:slug'>[],
      ]
      app.get('/blog/:slug', ...handlers)

      const mockPosts = [
        {
          slug: 'sicp',
          title: 'SICP',
          excerpt: 'Excerpt',
          date: '2026-01-01',
          category: 'SYS' as const,
          content: (() => null) as FC,
        },
      ]
      vi.mocked(blogService.getAllPosts).mockResolvedValue(mockPosts)

      const mockD1 = {
        prepare: vi.fn().mockReturnValue({
          bind: vi.fn().mockReturnThis(),
          all: vi.fn().mockResolvedValue([]),
          get: vi.fn().mockResolvedValue(null),
          run: vi.fn().mockResolvedValue({ success: true }),
          first: vi.fn().mockResolvedValue(null),
          raw: vi.fn().mockResolvedValue([]),
        }),
      } as unknown as D1Database

      const res = await app.request(
        '/blog/sicp',
        {},
        {
          // biome-ignore lint/style/useNamingConvention: <Cloudflare Bindings are uppercase>
          DB: mockD1,
        }
      )

      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).toContain('VIEW_COUNT')
    })

    it('存在しない記事にアクセスした場合、404 が返ること', async () => {
      const app = createTestApp()
      const handlers = blogRoute.default as unknown as [
        Handler<TestEnv, '/blog/:slug'>,
        ...Handler<TestEnv, '/blog/:slug'>[],
      ]
      app.get('/blog/:slug', ...handlers)
      vi.mocked(blogService.getAllPosts).mockResolvedValue([])

      const res = await app.request('/blog/non-existent-post')
      expect(res.status).toBe(404)
    })
  })
})
