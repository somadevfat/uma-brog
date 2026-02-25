import { describe, expect, it } from 'vitest'
import MobileMenu from '../../islands/mobile-menu'
import app from '../../server'

/**
 * MobileMenu Island コンポーネントのテスト。
 * SSR での存在確認を行い、Island がサーバーサイドから
 * 正しくエクスポートされることを検証する。
 */
describe('MobileMenu Island', () => {
  it('MobileMenu コンポーネントが定義されていること', () => {
    // ## Assert ##
    expect(MobileMenu).toBeDefined()
  })

  it('MobileMenu が関数コンポーネントであること', () => {
    // ## Assert ##
    expect(typeof MobileMenu).toBe('function')
  })
})

/**
 * レスポンシブ関連の HTML 出力テスト。
 * SSR レンダリング結果にモバイルメニュー関連のマークアップが
 * 含まれていることを確認する。
 */
describe('レスポンシブ HTML 出力', () => {
  it('ヘッダーにハンバーガーメニューの構造が含まれること', async () => {
    // ## Act ##
    const res = await app.request('/')

    // ## Assert ##
    expect(res.status).toBe(200)
    const html = await res.text()
    // ハンバーガーメニュー関連のクラスが出力に含まれる
    expect(html).toContain('hamburger-btn')
    expect(html).toContain('hamburger-icon')
    expect(html).toContain('hamburger-line')
  })

  it('すべてのナビリンクがデスクトップナビに存在すること', async () => {
    // ## Act ##
    const res = await app.request('/')

    // ## Assert ##
    const html = await res.text()
    // デスクトップナビのリンクが含まれている
    expect(html).toContain('About')
    expect(html).toContain('Projects')
    expect(html).toContain('Blog')
    expect(html).toContain('Contact')
  })

  it('テーマトグルがヘッダーに含まれること', async () => {
    // ## Act ##
    const res = await app.request('/')

    // ## Assert ##
    const html = await res.text()
    expect(html).toContain('theme-toggle')
  })

  it('ルートパスにアクティブクラスが付与されること', async () => {
    // ## Act ##
    const res = await app.request('/')

    // ## Assert ##
    const html = await res.text()
    // desktop nav で active クラスが存在
    expect(html).toContain('class="active"')
  })

  it('モバイルメニューの初期状態が閉じた状態であること', async () => {
    // ## Act ##
    const res = await app.request('/')

    // ## Assert ##
    const html = await res.text()
    // ハンバーガーボタンの初期状態は aria-expanded="false"
    expect(html).toContain('aria-expanded="false"')
  })

  it('各ページのヘッダーにハンバーガーメニューが含まれること', async () => {
    // ## Arrange ##
    const paths = ['/contact', '/portfolio', '/blog']

    // ## Act & Assert ##
    for (const path of paths) {
      const res = await app.request(path)
      expect(res.status).toBe(200)
      const html = await res.text()
      // すべてのページにハンバーガーボタンが含まれる
      expect(html).toContain('hamburger-btn')
    }
  })
})
