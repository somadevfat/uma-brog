import type { Post } from './types'

/**
 * ブログ記事に関連するサービス。
 * MDX ファイルから記事データを取得します。
 */
export const blogService = {
  /**
   * すべてのブログ記事を取得し、日付順（降順）にソートして返します。
   * @returns {Promise<Post[]>} 記事の配列。
   */
  async getAllPosts(): Promise<Post[]> {
    // import.meta.glob を使用して MDX ファイルを一括読み込み
    const posts = import.meta.glob<{
      frontmatter: { title: string; date: string; excerpt: string; category: Post['category'] }
      default: Post['content']
    }>('/src/content/blog/*.mdx', { eager: true })

    // 読み込んだファイルを Post オブジェクトの配列に変換
    return (
      Object.entries(posts)
        .map(([path, module]) => {
          const slug = path.split('/').pop()?.replace('.mdx', '') ?? ''
          return {
            slug,
            title: module.frontmatter.title,
            date: module.frontmatter.date,
            excerpt: module.frontmatter.excerpt,
            category: module.frontmatter.category,
            content: module.default,
          }
        })
        // 日付の新しい順にソート
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    )
  },

  /**
   * 指定されたスラッグに一致するブログ記事を取得します。
   * @param {string} slug - 記事のスラッグ。
   * @returns {Promise<Post | undefined>} 一致する記事、見つからない場合は undefined。
   */
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    // 全記事からスラッグが一致するものを検索
    const all = await this.getAllPosts()
    return all.find((p) => p.slug === slug)
  },
}
