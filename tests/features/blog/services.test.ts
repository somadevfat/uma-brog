import { test, expect } from 'vitest'
import { blogService } from '../../../src/features/blog/services'

test('blogService.getAllPosts() should return posts', async () => {
  const posts = await blogService.getAllPosts()
  expect(posts.length).toBeGreaterThan(0)
  expect(posts[0].title).toBe('SYSTEM ARCHIVE INITIALIZATION')
})
