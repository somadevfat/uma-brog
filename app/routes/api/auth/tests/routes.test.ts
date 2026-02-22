import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAuth } from '../../../../../src/lib/auth/client'
import app from '../../../../server'

// getAuth のモック化
vi.mock('../../../../../src/lib/auth/client', () => ({
  getAuth: vi.fn(),
}))

/**
 * 認証 API ルートのテスト。
 */
describe('Auth API Routes', () => {
  const mockAuth = {
    handler: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // biome-ignore lint/suspicious/noExplicitAny: <mocking purpose>
    vi.mocked(getAuth).mockReturnValue(mockAuth as any)
  })

  it('GET /api/auth/*：認証ハンドラーが正しく呼ばれること', async () => {
    // ## Arrange ##
    mockAuth.handler.mockResolvedValue(new Response('AUTH_GET_OK'))

    // ## Act ##
    const res = await app.request('/api/auth/session')

    // ## Assert ##
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('AUTH_GET_OK')
    expect(mockAuth.handler).toHaveBeenCalled()
  })

  it('POST /api/auth/*：認証ハンドラーが正しく呼ばれること', async () => {
    // ## Arrange ##
    mockAuth.handler.mockResolvedValue(new Response('AUTH_POST_OK'))

    // ## Act ##
    const res = await app.request('/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    })

    // ## Assert ##
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('AUTH_POST_OK')
    expect(mockAuth.handler).toHaveBeenCalled()
  })
})
