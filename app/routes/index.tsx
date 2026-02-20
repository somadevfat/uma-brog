import { createRoute } from 'honox/factory'
import { getPostsUseCase } from '../../src/features/blog/blog.factory'
import { PostList } from '../../src/features/blog/presentation/post-list'

export default createRoute(async (c) => {
  const posts = await getPostsUseCase.execute()
  return c.render(
    <div class="px-6 py-12 max-w-6xl mx-auto">
      <header class="mb-16">
        <h1 class="text-4xl font-thin mb-2 tracking-widest">UMA-BROG / SYSTEM ARCHIVE</h1>
        <div class="h-1 bg-accent-red w-24"></div>
      </header>

      <section class="mb-16">
        <h2 class="text-2xl font-thin mb-8 border-b border-border-line pb-2 tracking-widest uppercase">
          PROJECT ARCHIVE
        </h2>
        <PostList posts={posts} />
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 blueprint-border p-8">
          <h2 class="text-xl font-thin mb-6 border-b border-border-line pb-2 tracking-widest uppercase">
            LATEST_LOGS
          </h2>
          <div class="text-secondary mono text-sm">
            <p>&gt; NO RECENT ENTRIES FOUND</p>
            <p>&gt; STATUS: SCANNING_MDX_REPOSITORY...</p>
          </div>
        </div>
        
        <div class="blueprint-border p-8">
          <h2 class="text-xl font-thin mb-6 border-b border-border-line pb-2 tracking-widest uppercase">
            STATUS
          </h2>
          <ul class="text-xs mono space-y-2">
            <li class="flex justify-between"><span>CPU</span><span>NOMINAL</span></li>
            <li class="flex justify-between text-accent-red"><span>THREAT</span><span>NONE</span></li>
            <li class="flex justify-between"><span>ARCHIVE</span><span>ACTIVE</span></li>
          </ul>
        </div>
      </section>
    </div>
  )
})
