import type { NotFoundHandler } from 'hono'
import { ErrorPage } from '../../src/components/system/error-page'

/**
 * 404 Not Found ハンドラー。
 * 存在しないルートへアクセスされた際にエラーページをレンダリングします。
 * @param {Context} c - Hono コンテキスト。
 */
const handler: NotFoundHandler = (c) => {
  // 404 エラーページをレンダリング
  c.status(404)
  return c.render(<ErrorPage message="SIGNAL_LOST: POSITION_UNKNOWN" status={404} />, {
    title: '404 NOT FOUND',
    status: 404,
  })
}

export default handler
