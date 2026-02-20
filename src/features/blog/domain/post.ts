export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: any // React component from MDX
  category: 'technical' | 'book' | 'portfolio'
}

export interface IPostRepository {
  findAll(): Promise<Post[]>
  findBySlug(slug: string): Promise<Post | undefined>
}
