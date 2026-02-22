import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from '../../db/client'

/**
 * 環境変数の型定義。
 */
interface Env {
  /** D1 データベースインスタンス */
  DB: D1Database
}

/**
 * Better Auth インスタンスを取得します。
 * データベースアダプターとして Drizzle を使用し、メール/パスワード認証を有効にします。
 * @param {Env} env - 環境変数。
 * @returns Better Auth インスタンス。
 */
export const getAuth = (env: Env) => {
  // データベース接続を初期化
  const db = createDb(env.DB)

  // Better Auth の設定と生成
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}
