import type { FC } from 'hono/jsx'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  content: FC // MDX component
}
