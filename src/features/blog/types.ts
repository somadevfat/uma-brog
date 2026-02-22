import type { FC } from 'hono/jsx'

/**
 * ブログ記事の型定義。
 */
export interface Post {
  /** 記事のスラッグ（URLに使用） */
  slug: string
  /** 記事のタイトル */
  title: string
  /** 公開日 */
  date: string
  /** 記事の抜粋文 */
  excerpt: string
  /** 記事のカテゴリ */
  category: string
  /** MDX コンポーネント */
  content: FC
}
