import { createRoute } from 'honox/factory'
import { ProjectSearchList } from '../../app/islands/search-list'
import { portfolioService } from '../../src/features/portfolio/services'

/**
 * ポートフォリオページのルート定義。
 * プロジェクト一覧を取得し、検索機能付きグリッド形式で表示します。
 */
export default createRoute(async (c) => {
  // サービス層から全プロジェクト情報を取得
  const projects = await portfolioService.getAllProjects()

  // ポートフォリオ画面をレンダリング
  return c.render(
    <div class="py-12">
      <h2 class="section-title">PROJECTS</h2>

      {/* 検索機能付きプロジェクト一覧（Island） */}
      <ProjectSearchList projects={projects} />
    </div>
  )
})
