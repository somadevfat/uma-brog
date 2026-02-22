import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrizzleDB } from '../../../db/client'
import { analyticsService } from '../services'

/**
 * アナリティクスサービス (analyticsService) のテスト。
 */
describe('analyticsService', () => {
  // ## Arrange ##
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    get: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // select() が呼び出された時に自分自身を返すように設定（チェイン）
    mockDb.select.mockReturnThis()
  })

  describe('incrementViewCount()', () => {
    it('正常系：既存のレコードがある場合、カウントがインクリメントされること', async () => {
      // ## Arrange ##
      const slug = 'test-post'
      // 最初の select()...get() で既存レコードを返す
      mockDb.get.mockResolvedValueOnce({ slug, count: 5 })
      // 次の update()...get() で更新後のレコードを返す
      mockDb.get.mockResolvedValueOnce({ count: 6 })

      // ## Act ##
      const result = await analyticsService.incrementViewCount(mockDb as unknown as DrizzleDB, slug)

      // ## Assert ##
      expect(mockDb.update).toHaveBeenCalled()
      expect(result).toBe(6)
    })

    it('正常系：既存のレコードがない場合、新規作成されること', async () => {
      // ## Arrange ##
      const slug = 'new-post'
      mockDb.get.mockResolvedValueOnce(undefined) // 既存なし
      mockDb.get.mockResolvedValueOnce({ count: 1 }) // インサート結果

      // ## Act ##
      const result = await analyticsService.incrementViewCount(mockDb as unknown as DrizzleDB, slug)

      // ## Assert ##
      expect(mockDb.insert).toHaveBeenCalled()
      expect(result).toBe(1)
    })

    it('正常系：更新後レコードが取得できなかった場合 0 を返すこと', async () => {
      // ## Arrange ##
      mockDb.get.mockResolvedValueOnce({ slug: 'test', count: 1 })
      mockDb.get.mockResolvedValueOnce(undefined) // 更新失敗時など

      // ## Act ##
      const result = await analyticsService.incrementViewCount(
        mockDb as unknown as DrizzleDB,
        'test'
      )

      // ## Assert ##
      expect(result).toBe(0)
    })

    it('正常系：作成後レコードが取得できなかった場合 1 を返すこと', async () => {
      // ## Arrange ##
      mockDb.get.mockResolvedValueOnce(undefined)
      mockDb.get.mockResolvedValueOnce(undefined)

      // ## Act ##
      const result = await analyticsService.incrementViewCount(
        mockDb as unknown as DrizzleDB,
        'test'
      )

      // ## Assert ##
      expect(result).toBe(1)
    })
  })

  describe('getViewCount()', () => {
    it('正常系：レコードが存在する場合、カウントを返すこと', async () => {
      // ## Arrange ##
      mockDb.get.mockResolvedValue({ count: 10 })

      // ## Act ##
      const result = await analyticsService.getViewCount(mockDb as unknown as DrizzleDB, 'test')

      // ## Assert ##
      expect(result).toBe(10)
    })

    it('正常系：レコードが存在しない場合、0 を返すこと', async () => {
      // ## Arrange ##
      mockDb.get.mockResolvedValue(undefined)

      // ## Act ##
      const result = await analyticsService.getViewCount(mockDb as unknown as DrizzleDB, 'test')

      // ## Assert ##
      expect(result).toBe(0)
    })
  })
})
