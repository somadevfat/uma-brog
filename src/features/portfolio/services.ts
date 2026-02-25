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
        id: 'SOMA-DEVLOG',
        title: 'SOMA-DEVLOG / システムアーカイブ',
        description:
          'HonoXとCloudflare D1で構築された、レトロフューチャーでブループリントな美学を持つ堅牢なフルスタックポートフォリオブログシステム。',
        imageUrl: '/design/イメージ画.png',
        techStack: ['HonoX', 'Bun', 'Drizzle', 'D1', 'Better Auth'],
        tags: ['HonoX', 'Cloudflare', 'TypeScript', 'Bun'],
        githubUrl: 'https://github.com/somah/SOMA-DEVLOG',
        date: '2026-02-21',
      },
      {
        id: 'ASTRAL-TRADER',
        title: 'アストラルトレーダー / MQL5 EA',
        description:
          'MT5環境で動作する高度な自動売買エキスパートアドバイザー。ボラティリティと価格アクションの分析に基づき、XAUUSD市場での取引を自動化します。',
        imageUrl: undefined, // 画像がない場合のテスト用
        techStack: ['MQL5', 'MetaTrader 5', 'C++'],
        tags: ['MQL5', 'Trading', 'Algorithm', 'Forex'],
        githubUrl: 'https://github.com/somah/astral-trader',
        date: '2025-11-15',
      },
      {
        id: 'NEO-KANBAN',
        title: 'ネオ・カンバン / タスク管理アプリ',
        description:
          'TDDとDDD（ドメイン駆動設計）の実践として構築されたモダンなタスク管理ツール。ドラッグ＆ドロップによる直感的な操作と、リアルタイムな状態同期を実現。',
        imageUrl: '/design/イメージ画.png', // サンプル画像を使用
        techStack: ['React', 'Next.js', 'TailwindCSS', 'Zod', 'Prisma'],
        tags: ['React', 'Next.js', 'DDD', 'TDD'],
        githubUrl: 'https://github.com/somah/neo-kanban',
        date: '2025-08-30',
      },
    ]
  },
}
