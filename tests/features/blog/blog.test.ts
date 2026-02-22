import { expect, test } from 'vitest'
import app from '../../../app/server'

test('GET / should return 200 and contain the blog title', async () => {
  const res = await app.request('/')
  expect(res.status).toBe(200)
  const text = await res.text()
  expect(text).toContain('GRU Space')
})
