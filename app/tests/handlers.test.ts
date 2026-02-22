import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { describe, expect, it, vi } from 'vitest'
import notFoundHandler from '../routes/_404'
import errorHandler from '../routes/_error'

/**
 * グローバルハンドラー (404, Error) のテスト。
 */
describe('Global Handlers', () => {
  const createTestApp = () => {
    const app = new Hono()
    app.notFound(notFoundHandler)
    app.onError(errorHandler)

    app.use('*', async (c, next) => {
      // render のモック。any を使わずに型を指定
      c.render = vi
        .fn()
        .mockImplementation((_jsx: unknown, props: { title?: string; status?: number }) => {
          const status = (props.status || c.res.status || 200) as ContentfulStatusCode
          return c.html(`RENDERED: ${props.title}`, status)
        })
      await next()
    })

    return app
  }

  describe('404 Not Found Handler', () => {
    it('存在しないパスにアクセスした場合、404ハンドラーが動作すること', async () => {
      const app = createTestApp()
      const res = await app.request('/non-existent')

      expect(res.status).toBe(404)
      const text = await res.text()
      expect(text).toContain('RENDERED: 404 NOT FOUND')
    })
  })

  describe('Global Error Handler', () => {
    it('例外が発生した場合、500ハンドラーが動作すること', async () => {
      const app = createTestApp()
      app.get('/error', () => {
        throw new Error('TEST_EXCEPTION')
      })

      const res = await app.request('/error')

      expect(res.status).toBe(500)
      const text = await res.text()
      expect(text).toContain('RENDERED: 500 INTERNAL ERROR')
    })

    it('HTTPException が投げられた場合、そのレスポンスがそのまま返ること', async () => {
      const app = createTestApp()
      app.get('/http-error', () => {
        throw new HTTPException(401, { message: 'UNAUTHORIZED' })
      })

      const res = await app.request('/http-error')

      expect(res.status).toBe(401)
      expect(await res.text()).toBe('UNAUTHORIZED')
    })
  })
})
