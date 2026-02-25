import { createRoute } from 'honox/factory'
import { portfolioService } from '../../../src/features/portfolio/services'

/**
 * ポートフォリオプロジェクト詳細ページのルート定義。
 * IDに基づいてプロジェクトを取得し、表示します。
 */
export default createRoute(async (c) => {
  // URLパラメータからIDを取得
  const id = c.req.param('id')
  if (!id) {
    return c.notFound()
  }

  // IDに該当するプロジェクトをサービスから取得
  const project = await portfolioService.getProjectById(id)

  if (!project) {
    return c.notFound()
  }

  // MDXコンテンツ（コンポーネント）を取得
  const Content = project.content

  // 記事詳細画面をレンダリング
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        {/* カテゴリと日付のメタ情報 */}
        <div class="flex items-center gap-4 mb-4 text-sub mono text-xs uppercase">
          <span>PORTFOLIO</span>
          <div class="w-1 h-1 bg-border-color rounded-full"></div>
          <span>{project.date}</span>
        </div>
        <h1 class="text-3xl font-normal tracking-wider uppercase mb-4">{project.title}</h1>
        <div class="h-[2px] bg-accent-red w-20"></div>
      </header>

      {/* MDX本文 */}
      {Content ? (
        <article class="mdx-content blueprint-border p-8 bg-[#0D0D0D]">
          <Content />
        </article>
      ) : (
        <div class="blueprint-border p-8 bg-[#0D0D0D] text-sub">
          <p>This project has no detailed content.</p>
        </div>
      )}

      {/* フッター：戻るリンクと関連リンク */}
      <footer class="mt-16 pt-8 border-t border-border-line flex justify-between items-center">
        <a href="/portfolio" class="mono text-xs hover:text-accent-red">
          &lt; RETURN_TO_SYSTEM
        </a>
        <div class="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="btn text-xs px-2 py-1 h-auto"
            >
              GITHUB
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="btn text-xs px-2 py-1 h-auto"
            >
              LIVE
            </a>
          )}
        </div>
      </footer>
    </div>
  )
})
