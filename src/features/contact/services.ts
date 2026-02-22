import { desc, type InferSelectModel } from 'drizzle-orm'
import type { DrizzleDB } from '../../db/client'
import { messages } from '../../db/schema'

export type Message = InferSelectModel<typeof messages>

export const contactService = {
  async sendMessage(db: DrizzleDB, message: Message, webhookUrl?: string): Promise<void> {
    await db.insert(messages).values({
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      subject: message.subject,
      body: message.body,
      createdAt: message.createdAt,
    })

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

  async getAllMessages(db: DrizzleDB): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt))
  },
}
