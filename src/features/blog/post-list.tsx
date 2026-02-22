import type { Post } from './types'

export const PostList = ({ posts }: { posts: Post[] }) => {
  return (
    <div class="projects-grid">
      {posts.map((post) => (
        <article key={post.slug} class="card">
          <div class="card-img">
            {/* If there's no image URL, use a placeholder SVG as in the design sample */}
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

      {/* If no posts, show placeholders as in design sample? 
          Actually, the design sample had 4 cards. I'll just show what we have. 
      */}
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
