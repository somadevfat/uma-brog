import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

/**
 * HonoX サーバーアプリケーションインスタンスを作成します。
 */
const app = createApp()

/**
 * データベース接続を初期化するミドルウェア。
 * 各リクエストのコンテキストに Drizzle ORM インスタンスをセットします。
 */
// 以前ここに記述されていた DB ミドルウェアは app/routes/_middleware.ts に移動しました。

// 定義されたルートを表示
showRoutes(app)

export default app
