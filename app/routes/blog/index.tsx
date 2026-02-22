import { createRoute } from 'honox/factory'
import { PostList } from '../../../src/features/blog/post-list'
import { blogService } from '../../../src/features/blog/services'

export default createRoute(async (c) => {
  const posts = await blogService.getAllPosts()
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <h2 class="section-title">SYSTEM_LOGS</h2>
        <p class="text-sub font-xs mono mt-4">
          Accessing chronological archive of events and technical notes.
        </p>
      </header>

      <PostList posts={posts} />
    </div>
  )
})
