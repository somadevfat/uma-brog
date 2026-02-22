import { describe, expect, it } from 'vitest'
import app from '../../server'

/**
 * 静的ページ（Contact, Portfolio）のルーティングテスト。
 */
describe('Static Page Routes', () => {
  it('GET /contact：200 を返し、フォームが含まれていること', async () => {
    // ## Act ##
    const res = await app.request('/contact')

    // ## Assert ##
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('SIGNAL_STATION')
  })

  it('GET /portfolio：200 を返し、ポートフォリオ内容が含まれていること', async () => {
    // ## Act ##
    const res = await app.request('/portfolio')

    // ## Assert ##
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('PROJECT_BLUEPRINTS')
  })
})
