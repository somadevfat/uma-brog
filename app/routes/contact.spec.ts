import { expect, test } from '@playwright/test'

/**
 * お問い合わせページ（/contact）の E2E テスト。
 * API モックは MSW（Mock Service Worker）が担当する。
 * VITE_MSW=true で起動した dev サーバーに対してテストを実行する。
 */
test.describe('お問い合わせページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    // MSW の Service Worker がアクティブになるまで待機
    await page.waitForLoadState('networkidle')
  })

  // ページの基本表示確認
  test('ページタイトルが表示されること', async ({ page }) => {
    // ## Assert ##
    await expect(page.getByRole('heading', { name: 'お問い合わせ' })).toBeVisible()
  })

  test('お問い合わせフォームが表示されること', async ({ page }) => {
    // ## Assert ##
    await expect(page.getByPlaceholder('お名前を入力')).toBeVisible()
    await expect(page.getByPlaceholder('例: taro@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('件名を入力')).toBeVisible()
    await expect(page.getByPlaceholder('メッセージ内容を入力してください')).toBeVisible()
    await expect(page.getByRole('button', { name: '送信する' })).toBeVisible()
  })

  test('フォームに入力して送信すると完了画面に切り替わること', async ({ page }) => {
    // MSW が /api/contact の POST を 200 でモックしている

    // ## Act ##
    // ID でフォームフィールドを特定して入力
    await page.locator('#senderName').fill('テスト太郎')
    await page.locator('#senderEmail').fill('test@example.com')
    await page.locator('#subject').fill('テストの件名')
    await page.locator('#body').fill('テストのメッセージ内容です。')
    await page.getByRole('button', { name: '送信する' }).click()

    // ## Assert ##
    // 送信成功後は「送信完了」テキストと「新しいメッセージを送る」ボタンが表示される
    await expect(page.getByRole('heading', { name: '送信完了' })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('button', { name: '新しいメッセージを送る' })).toBeVisible()
  })
})
