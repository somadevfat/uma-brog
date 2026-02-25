import { expect, test } from '@playwright/test'
import { HeaderPage } from '../../e2e/fixtures/header-page'

/**
 * ヘッダーコンポーネントの E2E テスト。
 * デスクトップナビとモバイルハンバーガーメニューを検証する。
 */
test.describe('ヘッダー - デスクトップ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ナビゲーションの表示確認
  test('デスクトップナビゲーションが表示されること', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'モバイル環境ではハンバーガーメニューに格納されるためスキップ')
    // ## Arrange ##
    const header = new HeaderPage(page)

    // ## Assert ##
    await expect(header.desktopNavLink('About')).toBeVisible()
    await expect(header.desktopNavLink('Projects')).toBeVisible()
    await expect(header.desktopNavLink('Blog')).toBeVisible()
    await expect(header.desktopNavLink('Contact')).toBeVisible()
  })

  test('テーマトグルボタンが表示されること', async ({ page }) => {
    // ## Assert ##
    // theme-toggle クラスを持つ要素（Island）が存在すること
    await expect(page.locator('.theme-toggle')).toBeVisible()
  })
})

/**
 * ハンバーガーメニューのテスト（モバイルビューポート）。
 */
test.describe('ヘッダー - モバイル（375px）', () => {
  // モバイルビューポートに固定
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ハンバーガーボタンが表示されること', async ({ page }) => {
    // ## Arrange ##
    const header = new HeaderPage(page)

    // ## Assert ##
    await expect(header.hamburgerButton()).toBeVisible()
  })

  test('ハンバーガーメニューを開くとナビパネルが表示されること', async ({ page }) => {
    // ## Arrange ##
    const header = new HeaderPage(page)

    // ## Act ##
    await header.openMobileMenu()

    // ## Assert ##
    await expect(header.mobileNavPanel()).toBeVisible()
  })

  test('モバイルナビにすべてのリンクが表示されること', async ({ page }) => {
    // ## Arrange ##
    const header = new HeaderPage(page)

    // ## Act ##
    await header.openMobileMenu()

    // ## Assert ##
    const nav = header.mobileNavPanel()
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('モバイルナビのリンクをクリックするとメニューが閉じること', async ({ page }) => {
    // ## Arrange ##
    const header = new HeaderPage(page)
    await header.openMobileMenu()

    // ## Act ##
    await header.clickMobileNavLink('Blog')

    // ## Assert ##
    await expect(header.mobileNavPanel()).not.toBeVisible()
    await expect(page).toHaveURL(/\/blog/)
  })

  test('ESCキーでモバイルメニューが閉じること', async ({ page }) => {
    // ## Arrange ##
    const header = new HeaderPage(page)
    await header.openMobileMenu()
    await expect(header.mobileNavPanel()).toBeVisible()

    // ## Act ##
    await page.keyboard.press('Escape')

    // ## Assert ##
    await expect(header.mobileNavPanel()).not.toBeVisible()
  })
})
