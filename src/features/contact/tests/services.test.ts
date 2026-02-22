import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrizzleDB } from '../../../db/client'
import { type ContactMessage, contactService } from '../services'

/**
 * お問い合わせサービス (contactService) のテスト。
 * ロンドン学派（モック主義）に基づき、DB操作を隔離して検証します。
 */
describe('contactService', () => {
  // ## Arrange ##
  // DBのモックオブジェクトを作成
  const mockDb = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
    select: vi.fn(),
  }

  const mockQuery = {
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
  }

  const mockMessage: ContactMessage = {
    id: 'test-uuid',
    senderName: 'Test User',
    senderEmail: 'test@example.com',
    subject: 'Test Subject',
    body: 'Test Body',
    createdAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.select = vi.fn().mockReturnValue(mockQuery)
  })

  describe('sendMessage()', () => {
    it('正常系：メッセージがDBに挿入され、Webhookが指定されない場合はfetchが呼ばれないこと', async () => {
      // ## Arrange ##
      const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({} as Response)

      // ## Act ##
      await contactService.sendMessage(mockDb as unknown as DrizzleDB, mockMessage)

      // ## Assert ##
      expect(mockDb.insert).toHaveBeenCalled()
      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockMessage.id,
          senderName: mockMessage.senderName,
        })
      )
      expect(spyFetch).not.toHaveBeenCalled()
    })

    it('正常系：Webhook URLが指定された場合、fetchが正しく呼ばれること', async () => {
      // ## Arrange ##
      const webhookUrl = 'https://example.com/webhook'
      const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({} as Response)

      // ## Act ##
      await contactService.sendMessage(mockDb as unknown as DrizzleDB, mockMessage, webhookUrl)

      // ## Assert ##
      expect(spyFetch).toHaveBeenCalledWith(
        webhookUrl,
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining(mockMessage.senderName),
        })
      )
    })
  })

  describe('getAllMessages()', () => {
    it('正常系：メッセージを検索し、作成日時の降順でソートされること', async () => {
      // ## Arrange ##
      mockQuery.orderBy.mockResolvedValue([mockMessage])

      // ## Act ##
      const result = await contactService.getAllMessages(mockDb as unknown as DrizzleDB)

      // ## Assert ##
      expect(mockDb.select).toHaveBeenCalled()
      expect(mockQuery.from).toHaveBeenCalled()
      expect(mockQuery.orderBy).toHaveBeenCalled()
      expect(result).toEqual([mockMessage])
    })
  })
})
