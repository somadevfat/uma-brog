import { drizzle } from 'drizzle-orm/d1'
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import * as schema from '../src/db/schema'

/**
 * HonoX サーバーアプリケーションインスタンスを作成します。
 */
const app = createApp()

/**
 * データベース接続を初期化するミドルウェア。
 * 各リクエストのコンテキストに Drizzle ORM インスタンスをセットします。
 */
app.use('*', async (c, next) => {
  // 環境変数からDBを取得しDrizzleインスタンスを作成
  if (c.env.DB) {
    const db = drizzle(c.env.DB, { schema })
    c.set('db', db)
  }
  await next()
})

// 定義されたルートを表示
showRoutes(app)

export default app
