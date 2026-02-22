import { expect, test } from 'vitest'
import { blogService } from '../services'

/**
 * ブログサービス（記事取得ロジック）のテスト。
 */
test('blogService.getAllPosts()：記事を正常に取得し、最新の記事タイトルを確認', async () => {
  // 全記事を取得
  const posts = await blogService.getAllPosts()
  // 記事が1つ以上存在することを確認
  expect(posts.length).toBeGreaterThan(0)
  // 最初の記事のタイトルが期待通りであることを確認
  expect(posts[0].title).toBe('SYSTEM ARCHIVE INITIALIZATION')
})
