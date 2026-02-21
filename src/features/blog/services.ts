import { Post } from './types'

export const blogService = {
  async getAllPosts(): Promise<Post[]> {
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
  },

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const all = await this.getAllPosts()
    return all.find(p => p.slug === slug)
  }
}
