import { createRoute } from 'honox/factory'
import { getAuth } from '../../../../src/lib/auth/client'

/**
 * Better Auth の GET リクエストをハンドリングします。
 */
export const GET = createRoute((c) => {
  // 認証インスタンスを取得してリクエストを委譲
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

/**
 * Better Auth の POST リクエストをハンドリングします。
 */
export const POST = createRoute((c) => {
  // 認証インスタンスを取得してリクエストを委譲
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})
