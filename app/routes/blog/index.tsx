import { createRoute } from 'honox/factory'
import { PostList } from '../../../src/features/blog/post-list'
import { blogService } from '../../../src/features/blog/services'

/**
 * ブログ記事一覧ページのルート定義。
 * すべての記事を取得し、一覧形式で表示します。
 */
export default createRoute(async (c) => {
  // サービス層から全記事を取得
  const posts = await blogService.getAllPosts()

  // ブログ一覧画面をレンダリング
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <h2 class="section-title">SYSTEM_LOGS</h2>
        <p class="text-sub font-xs mono mt-4">
          Accessing chronological archive of events and technical notes.
        </p>
      </header>

      {/* 記事一覧リストを表示 */}
      <PostList posts={posts} />
    </div>
  )
})
