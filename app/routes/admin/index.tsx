import { createRoute } from 'honox/factory'
import { AdminDashboard } from '../../../src/features/admin/admin-dashboard'
import { contactService } from '../../../src/features/contact/services'

/**
 * 管理画面のトップページルート定義。
 * すべてのお問い合わせメッセージを取得し、ダッシュボードを表示します。
 */
export default createRoute(async (c) => {
  // データベースインスタンスを取得
  const db = c.var.db
  if (!db) {
    return c.notFound()
  }

  // サービス層から全メッセージを取得
  const allMessages = await contactService.getAllMessages(db)

  // 管理画面ダッシュボードをレンダリング
  return c.render(<AdminDashboard messages={allMessages} />)
})
