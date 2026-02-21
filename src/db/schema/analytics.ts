import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const viewCounts = sqliteTable('view_counts', {
  slug: text('slug').primaryKey(),
  count: integer('count').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
