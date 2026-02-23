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
    // プロジェクト一覧を定義
    return [
      {
        id: 'uma-brog',
        title: 'UMA-BLOG / SYSTEM ARCHIVE',
        description:
          'Robust full-stack portfolio blog system with Retro-Future blueprint aesthetics. Built with HonoX and Cloudflare D1.',
        imageUrl: '/design/イメージ画.png',
        techStack: ['HonoX', 'Bun', 'Drizzle', 'D1', 'Better Auth'],
        githubUrl: 'https://github.com/somah/uma-brog',
        date: '2026-02-21',
      },
    ]
  },
}
