import { expect, test } from 'vitest'
import app from '../../server'

/**
 * ブログの基本表示に関するテスト。
 */
test('GET /：200 ステータスを返し、サイトタイトルが含まれていることを確認', async () => {
  // ルートパスへリクエストを送信
  const res = await app.request('/')
  // レスポンスステータスを確認
  expect(res.status).toBe(200)
  // レスポンスボディを取得し、特定の文字列が含まれているかチェック
  const text = await res.text()
  expect(text).toContain('SOMA HIRANO')
})
