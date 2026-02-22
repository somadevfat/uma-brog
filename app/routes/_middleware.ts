import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import * as schema from '../../src/db/schema'

/**
 * データベース接続を初期化するグローバルミドルウェア。
 * 各リクエストのコンテキストに Drizzle ORM インスタンスをセットします。
 */
export const middleware = createMiddleware(async (c, next) => {
  // 環境変数からDBを取得しDrizzleインスタンスを作成
  if (c.env?.DB) {
    const db = drizzle(c.env.DB, { schema })
    c.set('db', db)
  }
  await next()
})
