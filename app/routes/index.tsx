import { createRoute } from 'honox/factory'
import { PostList } from '../../src/features/blog/post-list'
import { blogService } from '../../src/features/blog/services'

/**
 * ホームページのルート定義。
 * ヒーローセクションと最新のブログ記事一覧を表示します。
 */
export default createRoute(async (c) => {
  // ブログサービスから全記事を取得
  const posts = await blogService.getAllPosts()

  // ホーム画面をレンダリング
  return c.render(
    <div class="py-12">
      {/* ヒーローセクション：インパクトのある見出しと要約を表示 */}
      <section class="hero">
        <div class="hero-bg-placeholder"></div>
        <div class="hero-content">
          <h1>UMA-BLOG 事業詳細分析</h1>
          <p>観点：人類を多惑星種族にするための「前哨基地（くさび）」としての月面ホテル</p>
        </div>
      </section>

      {/* プロジェクト（ブログ記事）一覧セクション */}
      <section class="projects-section">
        <h2 class="section-title">MY PROJECTS</h2>
        <PostList posts={posts} />
      </section>
    </div>
  )
})
