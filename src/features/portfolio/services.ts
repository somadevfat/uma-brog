import type { Project } from './types'

/**
 * ポートフォリオ記事に関連するサービス。
 */
export const portfolioService = {
  /**
   * すべてのプロジェクト情報を取得します。
   * 現在は静的なデータを返しますが、将来的にDBからの取得に拡張可能です。
   * @returns {Promise<Project[]>} プロジェクトのリスト。
   */
  async getAllProjects(): Promise<Project[]> {
    const files = import.meta.glob<{
      frontmatter: {
        title: string
        date: string
        description: string
        imageUrl?: string
        techStack?: string[]
        tags?: string[]
        githubUrl?: string
        liveUrl?: string
      }
      // biome-ignore lint/suspicious/noExplicitAny: <hono mdx component>
      default: any
    }>('/src/content/portfolio/*.mdx', { eager: true })

    return (
      Object.entries(files)
        .map(([path, module]) => {
          const id = path.split('/').pop()?.replace('.mdx', '') ?? ''
          return {
            id,
            title: module.frontmatter.title,
            description: module.frontmatter.description,
            imageUrl: module.frontmatter.imageUrl,
            // 未指定の場合は空配列にフォールバック
            techStack: module.frontmatter.techStack ?? [],
            tags: module.frontmatter.tags ?? [],
            githubUrl: module.frontmatter.githubUrl,
            liveUrl: module.frontmatter.liveUrl,
            date: module.frontmatter.date,
            content: module.default,
          }
        })
        // 日付の新しい順（降順）にソート
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    )
  },

  /**
   * 指定されたID(スラッグ)のプロジェクトを取得します。
   * @param {string} id - プロジェクトのID（MDXのファイル名）
   * @returns {Promise<Project | undefined>} 一致するプロジェクト、見つからない場合は undefined。
   */
  async getProjectById(id: string): Promise<Project | undefined> {
    const all = await this.getAllProjects()
    return all.find((p) => p.id === id)
  },
}
