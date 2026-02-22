import type { Post } from './types'

/**
 * ブログ記事一覧を表示するコンポーネント。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Post[]} props.posts - 表示する記事の配列。
 * @returns {JSX.Element} 記事一覧リスト。
 */
export const PostList = ({ posts }: { posts: Post[] }) => {
  return (
    <div class="projects-grid">
      {/* 記事をカード形式で表示 */}
      {posts.map((post) => (
        <article key={post.slug} class="card">
          <div class="card-img">
            {/* デザイン案に基づいたプレースホルダーSVGを表示 */}
            <svg viewBox="0 0 100 50" stroke="#888" stroke-width="1" fill="none" aria-hidden="true">
              <title>Placeholder Graphic</title>
              <polyline points="10,40 40,15 60,30 90,10" />
              <line x1="0" y1="40" x2="100" y2="40" />
            </svg>
          </div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug}`} class="btn">
            View Project
          </a>
        </article>
      ))}

      {/* 記事が存在しない場合のプレースホルダー表示 */}
      {posts.length === 0 && (
        <div
          class="card"
          style={{
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-sub)',
          }}
        >
          <p class="mono text-xs">AWAITING_DATA...</p>
        </div>
      )}
    </div>
  )
}
