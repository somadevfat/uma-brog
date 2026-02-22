import type { D1Database } from '@cloudflare/workers-types'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { describe, expect, it, vi } from 'vitest'
import type { DrizzleDB } from '../../../db/client'
import { createDb } from '../../../db/client'
import { getAuth } from '../client'

// 外部モジュールのモック化
vi.mock('better-auth', () => ({
  betterAuth: vi.fn(),
}))
vi.mock('better-auth/adapters/drizzle', () => ({
  drizzleAdapter: vi.fn(),
}))
vi.mock('../../../db/client', () => ({
  createDb: vi.fn(),
}))

/**
 * Better Auth クライアントファクトリのテスト。
 */
describe('lib/auth/client', () => {
  it('getAuth()：認証インスタンスを正しく初期化して返すこと', () => {
    // ## Arrange ##
    const mockD1 = {
      prepare: vi.fn(),
    } as unknown as D1Database

    const mockDb = {
      select: vi.fn(),
    } as unknown as DrizzleDB

    // 戻り値の型に合わせて unknown を経由してキャスト
    const mockAdapter = { name: 'drizzle-adapter' } as unknown as ReturnType<typeof drizzleAdapter>
    // betterAuth の戻り値の型を模倣
    const mockAuthInstance = { handler: vi.fn() } as unknown as ReturnType<typeof betterAuth>

    vi.mocked(createDb).mockReturnValue(mockDb)
    vi.mocked(drizzleAdapter).mockReturnValue(mockAdapter)
    vi.mocked(betterAuth).mockReturnValue(mockAuthInstance)

    // ## Act ##
    const auth = getAuth({ DB: mockD1 })

    // ## Assert ##
    expect(createDb).toHaveBeenCalledWith(mockD1)
    expect(drizzleAdapter).toHaveBeenCalledWith(mockDb, { provider: 'sqlite' })
    expect(betterAuth).toHaveBeenCalled()
    expect(auth).toBe(mockAuthInstance)
  })
})
