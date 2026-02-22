import { eq, sql } from 'drizzle-orm'
import type { DrizzleDB } from '../../db/client'
import { viewCounts } from '../../db/schema'

export const analyticsService = {
  async incrementViewCount(db: DrizzleDB, slug: string): Promise<number> {
    const existing = await db.select().from(viewCounts).where(eq(viewCounts.slug, slug)).get()

    if (existing) {
      const updated = await db
        .update(viewCounts)
        .set({
          count: sql`${viewCounts.count} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(viewCounts.slug, slug))
        .returning({ count: viewCounts.count })
        .get()
      return updated?.count ?? 0
    } else {
      const inserted = await db
        .insert(viewCounts)
        .values({
          slug,
          count: 1,
          updatedAt: new Date(),
        })
        .returning({ count: viewCounts.count })
        .get()
      return inserted?.count ?? 1
    }
  },

  async getViewCount(db: DrizzleDB, slug: string): Promise<number> {
    const result = await db
      .select({ count: viewCounts.count })
      .from(viewCounts)
      .where(eq(viewCounts.slug, slug))
      .get()
    return result?.count ?? 0
  },
}
