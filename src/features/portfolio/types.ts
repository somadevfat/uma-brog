/**
 * プロジェクト情報の型定義。
 */
export interface Project {
  /** 一意の識別子 */
  id: string
  /** プロジェクト名 */
  title: string
  /** プロジェクトの説明 */
  description: string
  /** プレビュー画像のURL */
  imageUrl?: string
  /** 使用技術のリスト */
  techStack: string[]
  /** タグ一覧（検索・フィルタリングに利用） */
  tags: string[]
  /** GitHub リポジトリのURL */
  githubUrl?: string
  /** ライブサイトのURL */
  liveUrl?: string
  /** プロジェクトの作成日または公開日 */
  date: string
}
