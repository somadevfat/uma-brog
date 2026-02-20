import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const viewCounts = sqliteTable('view_counts', {
  slug: text('slug').primaryKey(),
  count: integer('count').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(), // better-auth or uuid
  senderName: text('sender_name').notNull(),
  senderEmail: text('sender_email').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
