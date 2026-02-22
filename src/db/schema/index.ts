import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { viewCounts } from './analytics'
import { messages } from './messages'

/**
 * データベーススキーマから Zod スキーマを生成してエクスポートします。
 * バリデーションや型定義に使用されます。
 */

// SELECT 用の Zod スキーマ
export const selectMessageSchema = createSelectSchema(messages)
export const selectViewCountSchema = createSelectSchema(viewCounts)

// INSERT 用の Zod スキーマ（バリデーションルールを含む）
export const insertMessageSchema = createInsertSchema(messages, {
  senderEmail: z.string().email(),
  senderName: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
})
export const insertViewCountSchema = createInsertSchema(viewCounts)

// 他のスキーマ定義を再エクスポート
export * from './analytics'
export * from './messages'
