import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * 記事の閲覧数を保存するテーブル定義。
 */
export const viewCounts = sqliteTable('view_counts', {
  /** 記事のスラッグ */
  slug: text('slug').primaryKey(),
  /** 閲覧数 */
  count: integer('count').notNull().default(0),
  /** 最終更新日時 */
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
