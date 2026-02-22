import type { Child } from 'hono/jsx'
import type { DrizzleDB } from '../src/db/client'

/**
 * Hono のグローバル型定義の拡張。
 */
declare module 'hono' {
  /**
   * コンテキストレンダラーの型定義。
   * JSX を Response に変換します。
   */
  interface ContextRenderer {
    (
      children: Child,
      props?: { title?: string; description?: string; status?: number }
    ): Response | Promise<Response>
  }

  /**
   * Hono の環境変数（Variables と Bindings）の型定義。
   */
  interface Env {
    /** ミドルウェアでセットされる変数 */
    Variables: {
      /** Drizzle データベースインスタンス */
      db: DrizzleDB
    }
    /** Cloudflare Workers のバインディング */
    Bindings: {
      /** D1 データベース */
      DB: D1Database
    }
  }
}
