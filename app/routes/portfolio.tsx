import { createRoute } from 'honox/factory'
import { ProjectGrid } from '../../src/features/portfolio/project-grid'
import { portfolioService } from '../../src/features/portfolio/services'

/**
 * ポートフォリオページのルート定義。
 * プロジェクト一覧を取得し、グリッド形式で表示します。
 */
export default createRoute(async (c) => {
  // サービス層から全プロジェクト情報を取得
  const projects = await portfolioService.getAllProjects()

  // ポートフォリオ画面をレンダリング
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <h2 class="section-title">PROJECT_BLUEPRINTS</h2>
        <p class="text-sub font-xs mono mt-4">
          Detailed technical specifications and implementation results.
        </p>
      </header>

      {/* プロジェクト一覧グリッドを表示 */}
      <ProjectGrid projects={projects} />
    </div>
  )
})
