import { test, expect } from 'vitest'
import { PostRepository } from '../../../src/features/blog/infrastructure/post-repository'

test('PostRepository.findAll() should return posts', async () => {
  const repo = new PostRepository()
  const posts = await repo.findAll()
  expect(posts.length).toBeGreaterThan(0)
  expect(posts[0].title).toBe('SYSTEM ARCHIVE INITIALIZATION')
})
