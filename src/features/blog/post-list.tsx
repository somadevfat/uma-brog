import { ContentGrid, postToCardItem } from '../../components/ui/content-card'
import type { Post } from './types'

/**
 * ブログ記事一覧をグリッド表示するコンポーネント。
 * 共通 ContentGrid + ContentCard を利用。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Post[]} props.posts - 表示する記事の配列。
 * @returns {JSX.Element} 記事一覧グリッド。
 */
export const PostList = ({ posts }: { posts: Post[] }) => {
  // Post → CardItem に変換してグリッドに渡す
  const items = posts.map(postToCardItem)
  return <ContentGrid items={items} emptyLabel="AWAITING_DATA..." />
}
