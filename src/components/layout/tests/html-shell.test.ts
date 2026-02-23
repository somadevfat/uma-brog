import type { Child } from 'hono/jsx'
import { describe, expect, it } from 'vitest'
import { HtmlShell } from '../html-shell'

/**
 * HtmlShell コンポーネントのテスト。
 */
describe('HtmlShell', () => {
  it('正常系：タイトルがある場合、正しくフォーマットされること', () => {
    // ## Act ##
    const node = HtmlShell({ children: 'Child', title: 'PAGE' }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('PAGE // SOMA-DEVLOG')
  })

  it('正常系：タイトルがない場合、デフォルトタイトルが使用されること', () => {
    // ## Act ##
    const node = HtmlShell({ children: 'Child' }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('SOMA-DEVLOG // SYSTEM ARCHIVE')
  })

  it('正常系：説明文がない場合、デフォルトの説明文が使用されること', () => {
    // ## Act ##
    const node = HtmlShell({ children: 'Child' }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('Technical Archive and Portfolio Blog')
  })
})
