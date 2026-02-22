import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createRoute } from 'honox/factory'
import { insertMessageSchema } from '../../../src/db/schema'
import { contactService } from '../../../src/features/contact/services'

/**
 * お問い合わせ送信用のバリデーションスキーマ。
 */
const schema = insertMessageSchema.pick({
  senderName: true,
  senderEmail: true,
  subject: true,
  body: true,
})

/**
 * お問い合わせを送信する POST エンドポイント。
 * バリデーション後にデータベースへメッセージを保存します。
 */
export const POST = createRoute(zValidator('json', schema), async (c) => {
  // バリデーション済みデータを取得
  const data = c.req.valid('json')

  // コンテキストからDBインスタンスを取得
  const db = c.var.db
  if (!db) {
    return c.json({ error: 'Database not available' }, 500)
  }

  try {
    // サービス層を介してメッセージを保存
    await contactService.sendMessage(db, {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    })
    return c.json({ success: true })
  } catch (_err) {
    // 送信失敗時のレスポンス
    return c.json({ success: false }, 500)
  }
})

/**
 * RPC 用の型定義。
 * フロントエンドで API クライアントを生成する際に使用します。
 */
const route = new Hono().post('/api/contact', ...POST)
export type AppType = typeof route
