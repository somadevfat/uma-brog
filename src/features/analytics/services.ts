import { eq, sql } from 'drizzle-orm'
import type { DrizzleDB } from '../../db/client'
import { viewCounts } from '../../db/schema'

/**
 * 閲覧数などのアナリティクスに関連するサービス。
 */
export const analyticsService = {
  /**
   * 指定されたスラッグの閲覧数をインクリメントします。
   * レコードが存在しない場合は新規作成します。
   * @param {DrizzleDB} db - Drizzle データベースインスタンス。
   * @param {string} slug - 記事のスラッグ。
   * @returns {Promise<number>} 更新後の閲覧数。
   */
  async incrementViewCount(db: DrizzleDB, slug: string): Promise<number> {
    // 既存の閲覧数レコードを取得
    const existing = await db.select().from(viewCounts).where(eq(viewCounts.slug, slug)).get()

    if (existing) {
      // レコードが存在する場合、カウントを1増やす
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
      // レコードが存在しない場合、新規作成
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

  /**
   * 指定されたスラッグの現在の閲覧数を取得します。
   * @param {DrizzleDB} db - Drizzle データベースインスタンス。
   * @param {string} slug - 記事のスラッグ。
   * @returns {Promise<number>} 現在の閲覧数。
   */
  async getViewCount(db: DrizzleDB, slug: string): Promise<number> {
    // スラッグに基づいて閲覧数を取得
    const result = await db
      .select({ count: viewCounts.count })
      .from(viewCounts)
      .where(eq(viewCounts.slug, slug))
      .get()
    return result?.count ?? 0
  },
}
