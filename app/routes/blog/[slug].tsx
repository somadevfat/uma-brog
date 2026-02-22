import { createRoute } from 'honox/factory'
import { analyticsService } from '../../../src/features/analytics/services'
import { blogService } from '../../../src/features/blog/services'

/**
 * ブログ記事詳細ページのルート定義。
 * スラッグに基づいて記事を取得し、閲覧数をカウントして表示します。
 */
export default createRoute(async (c) => {
  // URLパラメータからスラッグを取得
  const slug = c.req.param('slug')
  if (!slug) {
    return c.notFound()
  }

  // スラッグに該当する記事をサービスから取得
  const post = await blogService.getPostBySlug(slug)

  if (!post) {
    return c.notFound()
  }

  // 閲覧数をインクリメント（DBが利用可能な場合のみ）
  let viewCount = 0
  const db = c.var.db
  if (db) {
    viewCount = await analyticsService.incrementViewCount(db, slug)
  }

  // 記事の内容（コンポーネント）を取得
  const Content = post.content

  // 記事詳細画面をレンダリング
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        {/* カテゴリと日付のメタ情報 */}
        <div class="flex items-center gap-4 mb-4 text-sub mono text-xs uppercase">
          <span>{post.category}</span>
          <div class="w-1 h-1 bg-border-color rounded-full"></div>
          <span>{post.date}</span>
        </div>
        <h1 class="text-3xl font-normal tracking-wider uppercase mb-4">{post.title}</h1>
        <div class="h-[2px] bg-accent-red w-20"></div>
      </header>

      {/* 記事本文 */}
      <article class="mdx-content blueprint-border p-8 bg-[#0D0D0D]">
        <Content />
      </article>

      {/* フッター：戻るリンクと閲覧数表示 */}
      <footer class="mt-16 pt-8 border-t border-border-line flex justify-between items-center">
        <a href="/" class="mono text-xs hover:text-accent-red">
          &lt; RETURN_TO_SYSTEM
        </a>
        <div class="text-[10px] text-secondary mono">
          VIEW_COUNT: {viewCount.toString().padStart(6, '0')}
        </div>
      </footer>
    </div>
  )
})
