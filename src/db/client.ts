import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

/**
 * Drizzle データベースインスタンスの型定義。
 */
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>

/**
 * D1 データベースから Drizzle インスタンスを作成します。
 * @param {D1Database} d1 - Cloudflare D1 インスタンス。
 * @returns {DrizzleDB} Drizzle ORM インスタンス。
 */
export const createDb = (d1: D1Database) => {
  // 指定されたスキーマを使用して Drizzle を初期化
  return drizzle(d1, { schema })
}
