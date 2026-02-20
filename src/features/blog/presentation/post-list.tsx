import { Post } from '../domain/post'

export const PostList = ({ posts }: { posts: Post[] }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div key={post.slug} class="blueprint-border p-8 hover:border-accent-red transition-colors group relative overflow-hidden flex flex-col">
          <div class="absolute top-0 right-0 p-2 text-[10px] text-secondary mono uppercase">{post.category}-{post.date.replace(/-/g, '')}</div>
          <h3 class="text-xl mb-4 group-hover:text-accent-red transition-colors mono">{post.title}</h3>
          <p class="text-sm text-secondary mb-6 flex-grow">{post.excerpt}</p>
          <a href={`/blog/${post.slug}`} class="btn-blueprint text-center">ACCESS_LOG</a>
        </div>
      ))}
      {posts.length === 0 && (
        <div class="blueprint-border p-8 border-dashed flex flex-col items-center justify-center text-secondary md:col-span-3">
          <span class="mono text-xs mb-2">AWAITING_DATA...</span>
          <div class="w-12 h-[1px] bg-border-line"></div>
        </div>
      )}
    </div>
  )
}
