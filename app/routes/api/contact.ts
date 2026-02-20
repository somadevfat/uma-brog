import { createRoute } from 'honox/factory'
import { ContactRepository } from '../../../src/features/contact/infrastructure/contact-repository'
import { SendMessageUseCase } from '../../../src/features/contact/application/send-message'
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
    
    // We can't use c.env in standard Route if not provided by bindings
    // But in Cloudflare Pages, it's there.
    if (!c.env.DB) {
      return c.json({ error: 'Database not available' }, 500)
    }

    const repository = new ContactRepository(c.env.DB) // Can add Webhook URL here if needed
    const useCase = new SendMessageUseCase(repository)

    try {
      await useCase.execute(data)
      return c.json({ success: true })
    } catch (err) {
      return c.json({ success: false }, 500)
    }
  }
)
