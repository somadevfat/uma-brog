import { desc, type InferSelectModel } from 'drizzle-orm'
import type { DrizzleDB } from '../../db/client'
import { messages } from '../../db/schema'

/**
 * メッセージテーブルのセレクトモデル型。
 */
export type ContactMessage = InferSelectModel<typeof messages>

/**
 * お問い合わせメッセージに関連するサービス。
 */
export const contactService = {
  /**
   * メッセージを送信（保存）し、オプションでWebhookに通知します。
   * @param {DrizzleDB} db - Drizzle データベースインスタンス。
   * @param {Message} message - 送信するメッセージ内容。
   * @param {string} [webhookUrl] - 通知先のWebhook URL（任意）。
   * @returns {Promise<void>}
   */
  async sendMessage(db: DrizzleDB, message: ContactMessage, webhookUrl?: string): Promise<void> {
    // データベースにメッセージを挿入
    await db.insert(messages).values({
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      subject: message.subject,
      body: message.body,
      createdAt: message.createdAt,
    })

    // Webhook URLが指定されている場合、通知を送信
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📡 **NEW SIGNAL RECEIVED**\n**From**: ${message.senderName} (${message.senderEmail})\n**Subject**: ${message.subject}\n**Body**: ${message.body}`,
        }),
      })
    }
  },

  /**
   * すべてのメッセージを新しい順に取得します。
   * @param {DrizzleDB} db - Drizzle データベースインスタンス。
   * @returns {Promise<Message[]>} メッセージの配列。
   */
  async getAllMessages(db: DrizzleDB): Promise<ContactMessage[]> {
    // 作成日時の降順で全メッセージを取得
    return await db.select().from(messages).orderBy(desc(messages.createdAt))
  },
}
