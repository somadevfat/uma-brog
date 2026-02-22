import type { D1Database } from '@cloudflare/workers-types'
import { describe, expect, it, vi } from 'vitest'
import { createDb } from '../client'

/**
 * DB クライアントファクトリのテスト。
 */
describe('db/client', () => {
  it('createDb()：D1 インスタンスから Drizzle インストンスを作成できること', () => {
    // ## Arrange ##
    const mockD1 = {
      prepare: vi.fn(),
    } as unknown as D1Database

    // ## Act ##
    const db = createDb(mockD1)

    // ## Assert ##
    expect(db).toBeDefined()
    // drizzle インスタンス特有のメソッドが存在することを確認
    expect(db.select).toBeDefined()
    expect(db.insert).toBeDefined()
  })
})
