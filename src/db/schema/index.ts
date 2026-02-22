import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { viewCounts } from './analytics'
import { messages } from './messages'

// Select schemas
export const selectMessageSchema = createSelectSchema(messages)
export const selectViewCountSchema = createSelectSchema(viewCounts)

// Insert schemas (Validation)
export const insertMessageSchema = createInsertSchema(messages, {
  senderEmail: z.string().email(),
  senderName: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
})
export const insertViewCountSchema = createInsertSchema(viewCounts)

export * from './analytics'
export * from './messages'
