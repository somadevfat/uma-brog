import { createRoute } from 'honox/factory'
import { contactService } from '../../../src/features/contact/services'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const schema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
})

export const POST = createRoute(
  zValidator('json', schema),
  async (c) => {
    const data = c.req.valid('json')
    
    const db = c.var.db
    if (!db) {
      return c.json({ error: 'Database not available' }, 500)
    }

    try {
      await contactService.sendMessage(db, {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date()
      })
      return c.json({ success: true })
    } catch (err) {
      return c.json({ success: false }, 500)
    }
  }
)
