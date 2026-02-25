import { expect, test } from '@playwright/test'

/**
 * ホームページ（/）の E2E テスト。
 * ページの主要コンテンツの表示を検証する。
 */
test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ページの基本表示確認
  test('200 でレスポンスし、タイトルが表示されること', async ({ page }) => {
    // ## Assert ##
    await expect(page).toHaveTitle(/SOMA-DEVLOG/)
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('ヒーローセクションが表示されること', async ({ page }) => {
    // ## Assert ##
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('ナビゲーションリンクがすべて表示されること', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'モバイル環境ではハンバーガーメニューに格納されるためスキップ')
    // ## Assert ##
    const nav = page.locator('nav.main-nav')
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible()
  })
})
