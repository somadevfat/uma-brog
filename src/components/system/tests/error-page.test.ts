import type { Child } from 'hono/jsx'
import { describe, expect, it } from 'vitest'
import { ErrorPage } from '../error-page'

/**
 * ErrorPage コンポーネントのテスト。
 */
describe('ErrorPage', () => {
  it('正常系：指定されたメッセージとステータスをレンダリングすること', () => {
    // ## Act ##
    const node = ErrorPage({ message: 'TEST_ERR', status: 418 }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('TEST_ERR')
    expect(html).toContain('418')
    expect(html).toContain('FAULT_DETECTED')
  })
})
