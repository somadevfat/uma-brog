import type { ErrorHandler } from 'hono'
import { ErrorPage } from '../../src/components/system/error-page'

/**
 * アプリケーションのグローバルエラーハンドラー。
 * 予期しないエラーが発生した際にエラーページをレンダリングします。
 * @param {Error} e - 発生したエラー。
 * @param {Context} c - Hono コンテキスト。
 */
const handler: ErrorHandler = (e, c) => {
  // すでにレスポンスが定義されている場合はそれを返す
  if ('getResponse' in e) {
    // biome-ignore lint/suspicious/noExplicitAny: <better-auth/hono error structure>
    return (e as any).getResponse()
  }

  // エラーログを出力
  console.error(e.message)

  // エラーページをレンダリング
  c.status(500)
  return c.render(<ErrorPage message={`SYSTEM_HALT: ${e.message.toUpperCase()}`} status={500} />, {
    title: '500 INTERNAL ERROR',
    status: 500,
  })
}

export default handler
