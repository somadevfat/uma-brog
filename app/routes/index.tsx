import { createRoute } from 'honox/factory'
import { PostList } from '../../src/features/blog/post-list'
import { blogService } from '../../src/features/blog/services'

export default createRoute(async (c) => {
  const posts = await blogService.getAllPosts()
  return c.render(
    <div class="py-12">
      <section class="hero">
        <div class="hero-bg-placeholder"></div>
        <div class="hero-content">
          <h1>GRU Space 事業詳細分析</h1>
          <p>観点：人類を多惑星種族にするための「前哨基地（くさび）」としての月面ホテル</p>
        </div>
      </section>

      <section class="projects-section">
        <h2 class="section-title">MY PROJECTS</h2>
        <PostList posts={posts} />
      </section>
    </div>
  )
})
