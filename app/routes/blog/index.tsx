import { createRoute } from 'honox/factory'
import { BlogSearchList } from '../../../app/islands/search-list'
import { blogService } from '../../../src/features/blog/services'

/**
 * ブログ記事一覧ページのルート定義。
 * すべての記事を取得し、検索機能付き一覧として表示します。
 */
export default createRoute(async (c) => {
  // サービス層から全記事を取得
  const posts = await blogService.getAllPosts()

  // ブログ一覧画面をレンダリング
  return c.render(
    <div class="py-12">
      <h2 class="section-title">LOGS</h2>

      {/* 検索機能付きブログ一覧（Island） */}
      <BlogSearchList posts={posts} />
    </div>
  )
})
