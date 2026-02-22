import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * お問い合わせメッセージを保存するテーブル定義。
 */
export const messages = sqliteTable('messages', {
  /** メッセージ ID */
  id: text('id').primaryKey(),
  /** 送信者名 */
  senderName: text('sender_name').notNull(),
  /** 送信者メールアドレス */
  senderEmail: text('sender_email').notNull(),
  /** 件名 */
  subject: text('subject').notNull(),
  /** 本文 */
  body: text('body').notNull(),
  /** 受信日時 */
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
