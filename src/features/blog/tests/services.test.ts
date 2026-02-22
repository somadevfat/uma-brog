import { describe, expect, test } from 'vitest'
import { blogService } from '../services'

/**
 * ブログサービス（記事取得ロジック）のテスト。
 */
describe('blogService', () => {
  test('getAllPosts()：記事を正常に取得し、日付順（降順）にソートされていることを確認', async () => {
    // ## Arrange ##
    // 特になし（MDXファイルから直接取得するため）

    // ## Act ##
    const posts = await blogService.getAllPosts()

    // ## Assert ##
    expect(posts.length).toBeGreaterThan(0)
    // 日付順の確認
    const dates = posts.map((p) => new Date(p.date).getTime())
    const sortedDates = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(sortedDates)
  })

  test('getPostBySlug()：存在するスラッグを指定した場合、該当する記事を返すこと', async () => {
    // ## Arrange ##
    const allPosts = await blogService.getAllPosts()
    const target = allPosts[0]

    // ## Act ##
    const post = await blogService.getPostBySlug(target.slug)

    // ## Assert ##
    expect(post).toBeDefined()
    expect(post?.slug).toBe(target.slug)
    expect(post?.title).toBe(target.title)
  })

  test('getPostBySlug()：存在しないスラッグを指定した場合、undefinedを返すこと', async () => {
    // ## Arrange ##
    const slug = 'non-existent-post'

    // ## Act ##
    const post = await blogService.getPostBySlug(slug)

    // ## Assert ##
    expect(post).toBeUndefined()
  })
})
