import type { Page } from '@playwright/test'

/**
 * ヘッダーナビゲーションの Page Object。
 * デスクトップナビとモバイルハンバーガーメニューの操作を一元管理する。
 */
export class HeaderPage {
  constructor(private readonly page: Page) {}

  /**
   * デスクトップのナビリンクロケーターを返す。
   * @param {string} name - リンクのテキスト。
   */
  desktopNavLink(name: string) {
    return this.page.locator('nav.main-nav').getByRole('link', { name })
  }

  /**
   * ハンバーガーボタンロケーターを返す。
   */
  hamburgerButton() {
    return this.page.getByRole('button', { name: /メニューを開く|メニューを閉じる/ })
  }

  /**
   * モバイルナビゲーションパネルロケーターを返す。
   */
  mobileNavPanel() {
    return this.page.getByRole('navigation', { name: 'モバイルナビゲーション' })
  }

  /**
   * ハンバーガーメニューを開く。
   * Islands のハイドレーション完了後にボタンが有効になるのを待つ。
   */
  async openMobileMenu() {
    const btn = this.hamburgerButton()
    // ハイドレーション後にボタンが visible + enabled になるまで待機
    await btn.waitFor({ state: 'visible' })
    await btn.click()
  }

  /**
   * モバイルナビ内のリンクをクリックしてナビゲートする。
   * @param {string} name - リンクのテキスト。
   */
  async clickMobileNavLink(name: string) {
    await this.mobileNavPanel().getByRole('link', { name }).click()
  }
}
