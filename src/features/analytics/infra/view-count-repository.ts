import { createDb } from '../../../lib/db/client'
import { viewCounts } from '../../../lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export class ViewCountRepository {
  constructor(private d1: D1Database) {}

  async increment(slug: string): Promise<number> {
    const db = createDb(this.d1)
    
    // Upsert equivalent in SQLite/Drizzle
    const existing = await db.select().from(viewCounts).where(eq(viewCounts.slug, slug)).get()
    
    if (existing) {
      const updated = await db.update(viewCounts)
        .set({ 
          count: sql`${viewCounts.count} + 1`,
          updatedAt: new Date()
        })
        .where(eq(viewCounts.slug, slug))
        .returning({ count: viewCounts.count })
        .get()
      return updated?.count ?? 0
    } else {
      const inserted = await db.insert(viewCounts)
        .values({
          slug,
          count: 1,
          updatedAt: new Date()
        })
        .returning({ count: viewCounts.count })
        .get()
      return inserted?.count ?? 1
    }
  }

  async get(slug: string): Promise<number> {
    const db = createDb(this.d1)
    const result = await db.select({ count: viewCounts.count }).from(viewCounts).where(eq(viewCounts.slug, slug)).get()
    return result?.count ?? 0
  }
}
