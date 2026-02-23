import { createRoute } from 'honox/factory'
import { PostList } from '../../src/features/blog/post-list'
import { blogService } from '../../src/features/blog/services'
import { ProjectGrid } from '../../src/features/portfolio/project-grid'
import { portfolioService } from '../../src/features/portfolio/services'

/**
 * ホームページのルート定義。
 * ヒーローセクション、最新のプロジェクト、およびブログ記事一覧を表示します。
 */
export default createRoute(async (c) => {
  // ブログサービスから全記事を取得
  const posts = await blogService.getAllPosts()
  // ポートフォリオサービスから全プロジェクト情報を取得
  const projects = await portfolioService.getAllProjects()

  // ホーム画面をレンダリング
  return c.render(
    <div class="py-12">
      {/* ヒーローセクション：短縮版 */}
      <section class="hero">
        <div class="hero-bg-placeholder"></div>
        <div class="hero-content">
          <h1>SOMA HIRANO</h1>
          <p>SOFTWARE ENGINEER</p>
          {/* ソーシャルリンク：GitHub・メール・X */}
          <div class="hero-links">
            <a
              href="https://github.com/somah"
              target="_blank"
              rel="noopener noreferrer"
              class="hero-link"
              aria-label="GitHub"
            >
              {/* GitHub アイコン */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
            <a href="mailto:soma@example.com" class="hero-link" aria-label="メール">
              {/* メールアイコン */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              MAIL
            </a>
            <a
              href="https://x.com/somah"
              target="_blank"
              rel="noopener noreferrer"
              class="hero-link"
              aria-label="X (Twitter)"
            >
              {/* X (Twitter) アイコン */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </a>
          </div>
        </div>
      </section>

      {/* プロジェクト一覧セクション */}
      <section class="mb-12">
        <h2 class="section-title">FEATURED PROJECTS</h2>
        <ProjectGrid projects={projects} />
      </section>

      {/* ブログ記事一覧セクション */}
      <section class="blog-section">
        <h2 class="section-title">LATEST BLOGS</h2>
        <PostList posts={posts} />
      </section>
    </div>
  )
})
