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
          <h1>SOMA HIRANO</h1>
          <p>Next.js, React, Node.js, GCP, Cloudflare。エンドツーエンドのソリューション提供。</p>
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
