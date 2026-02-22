import { zValidator } from '@hono/zod-validator'
import { createRoute } from 'honox/factory'
import { insertMessageSchema } from '../../../src/db/schema'
import { contactService } from '../../../src/features/contact/services'

const schema = insertMessageSchema.pick({
  senderName: true,
  senderEmail: true,
  subject: true,
  body: true,
})

export const POST = createRoute(zValidator('json', schema), async (c) => {
  const data = c.req.valid('json')

  const db = c.var.db
  if (!db) {
    return c.json({ error: 'Database not available' }, 500)
  }

  try {
    await contactService.sendMessage(db, {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    })
    return c.json({ success: true })
  } catch (_err) {
    return c.json({ success: false }, 500)
  }
})
