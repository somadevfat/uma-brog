import { IContactRepository, Message } from '../domain/message'
import { createDb } from '../../../lib/db/client'
import { messages } from '../../../lib/db/schema'

export class ContactRepository implements IContactRepository {
  constructor(private d1: D1Database, private webhookUrl?: string) {}

  async save(message: Message): Promise<void> {
    const db = createDb(this.d1)
    await db.insert(messages).values({
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      subject: message.subject,
      body: message.body,
      createdAt: message.createdAt,
    })

    if (this.webhookUrl) {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📡 **NEW SIGNAL RECEIVED**\n**From**: ${message.senderName} (${message.senderEmail})\n**Subject**: ${message.subject}\n**Body**: ${message.body}`
        })
      })
    }
  }
}
