import { Post, IPostRepository } from '../domain/post'

export class PostRepository implements IPostRepository {
  async findAll(): Promise<Post[]> {
    const posts = import.meta.glob<{
      frontmatter: { title: string; date: string; excerpt: string; category: Post['category'] }
      default: any
    }>('/src/content/blog/*.mdx', { eager: true })

    return Object.entries(posts).map(([path, module]) => {
      const slug = path.split('/').pop()?.replace('.mdx', '') ?? ''
      return {
        slug,
        title: module.frontmatter.title,
        date: module.frontmatter.date,
        excerpt: module.frontmatter.excerpt,
        category: module.frontmatter.category,
        content: module.default,
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async findBySlug(slug: string): Promise<Post | undefined> {
    const all = await this.findAll()
    return all.find(p => p.slug === slug)
  }
}
