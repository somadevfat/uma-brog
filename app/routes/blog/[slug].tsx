import { createRoute } from 'honox/factory'
import { getPostBySlugUseCase } from '../../../src/features/blog/blog.factory'
import { ViewCountRepository } from '../../../src/features/analytics/infra/view-count-repository'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')
  if (!slug) return c.notFound()
  const post = await getPostBySlugUseCase.execute(slug)

  if (!post) {
    return c.notFound()
  }

  // Increment view count if DB is available
  let viewCount = 0
  if (c.env.DB) {
    const viewRepo = new ViewCountRepository(c.env.DB)
    viewCount = await viewRepo.increment(slug)
  }

  const Content = post.content

  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-4 text-sub mono text-xs uppercase">
          <span>{post.category}</span>
          <div class="w-1 h-1 bg-border-color rounded-full"></div>
          <span>{post.date}</span>
        </div>
        <h1 class="text-3xl font-normal tracking-wider uppercase mb-4">{post.title}</h1>
        <div class="h-[2px] bg-accent-red w-20"></div>
      </header>

      <article class="mdx-content blueprint-border p-8 bg-[#0D0D0D]">
        <Content />
      </article>

      <footer class="mt-16 pt-8 border-t border-border-line flex justify-between items-center">
        <a href="/" class="mono text-xs hover:text-accent-red">&lt; RETURN_TO_SYSTEM</a>
        <div class="text-[10px] text-secondary mono">VIEW_COUNT: {viewCount.toString().padStart(6, '0')}</div>
      </footer>
    </div>
  )
})
