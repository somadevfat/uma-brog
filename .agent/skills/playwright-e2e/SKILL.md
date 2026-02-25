---
name: playwright-e2e
description: HonoX プロジェクトにおける Playwright E2E テストのベストプラクティス。ページ単位の UI テストを担当し、Vitest のユニットテストと明確に役割分担する。公式ドキュメント (playwright.dev/docs/best-practices) に準拠した 2025年最新版。
---

# Playwright E2E スキル

HonoX + Cloudflare Workers 環境における Playwright の導入・運用ガイド。
**Playwright はページ（`.tsx` ルートファイル）単位の E2E テストを担当**し、Vitest はロジック（`.ts`）のユニットテストのみを担当します。

## 1. テスト責務の分担（重要）

| テスト対象 | ツール | ファイル拡張子 |
|---|---|---|
| ページの表示・UI インタラクション | **Playwright** | `*.spec.ts`（`e2e/` 以下） |
| ビジネスロジック・フック・ユーティリティ | **Vitest** | `*.test.ts`（実装隣接 `tests/`） |
| 定数・型定義 | **テスト対象外** | — |

```text
e2e/                        # Playwright テスト専用ディレクトリ
  pages/
    home.spec.ts            # / ページの E2E テスト
    contact.spec.ts         # /contact ページの E2E テスト
    portfolio.spec.ts       # /portfolio ページの E2E テスト
    blog.spec.ts            # /blog ページの E2E テスト
  components/
    header.spec.ts          # ヘッダー・ハンバーガーメニューの E2E テスト
  fixtures/                 # 共通フィクスチャ定義
    index.ts
playwright.config.ts        # Playwright 設定ファイル
```

## 2. セットアップ

### 2.1. インストール

```bash
npx playwright install --with-deps chromium
```

CI では Chromium のみインストールして帯域・ディスクを節約します。

### 2.2. `playwright.config.ts`（必須設定）

```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright の基本設定。
 * webServer によりテスト実行前に開発サーバーを自動起動します。
 */
export default defineConfig({
  // E2E テストディレクトリ
  testDir: './e2e',
  // すべてのテストを並列実行
  fullyParallel: true,
  // CI で test.only が残っていたらビルド失敗
  forbidOnly: !!process.env.CI,
  // CI のみリトライ（フレーキー対策）
  retries: process.env.CI ? 2 : 0,
  // CI では並列数を制限
  workers: process.env.CI ? 1 : undefined,
  // レポーター: ローカルは html、CI は GitHub Actions 向け
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    // テスト対象の Base URL
    baseURL: 'http://localhost:5173',
    // 失敗時の最初のリトライでトレースを収集
    trace: 'on-first-retry',
    // CI 以外はスクリーンショットを失敗時のみ保存
    screenshot: 'only-on-failure',
  },
  // Chromium のみでテスト（本番環境に合わせる）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // モバイルビューポートでのレスポンシブテスト
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // テスト実行前に開発サーバーを起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 3. テストの書き方

### 3.1. ロケーターの優先順位（公式推奨）

```typescript
// ✅ ロール + 名前（最優先）
page.getByRole('button', { name: '送信する' })

// ✅ ラベルテキスト
page.getByLabel('メールアドレス')

// ✅ プレースホルダー
page.getByPlaceholder('例: taro@example.com')

// ✅ テキスト
page.getByText('お問い合わせ')

// ✅ テスト ID（最後の手段: data-testid 属性）
page.getByTestId('submit-btn')

// ❌ CSS クラス（DOM 変更に脆弱）
page.locator('button.hamburger-btn')

// ❌ XPath（保守性が低い）
page.locator('//button[@class="hamburger-btn"]')
```

### 3.2. Web First アサーション（必須）

```typescript
// ✅ Web First: 要素が表示されるまで自動で待機
await expect(page.getByText('送信完了')).toBeVisible()
await expect(page.getByRole('navigation')).toBeVisible()

// ❌ これは NG: isVisible() は即時評価して待機しない
expect(await page.getByText('送信完了').isVisible()).toBe(true)
```

### 3.3. Page Object Model（POM）の採用

ページごとの操作をクラスに閉じ込め、テストコードを DRY に保ちます。

```typescript
// e2e/fixtures/pages/contact-page.ts

/**
 * お問い合わせページの Page Object。
 * ページ操作を一元管理し、テストコードから実装詳細を隠蔽する。
 */
export class ContactPage {
  constructor(private readonly page: Page) {}

  /** お問い合わせページに移動する */
  async goto() {
    await this.page.goto('/contact')
  }

  /** フォームに入力して送信する */
  async fillAndSubmit(data: {
    name: string
    email: string
    subject: string
    body: string
  }) {
    await this.page.getByLabel('お名前').fill(data.name)
    await this.page.getByLabel('メールアドレス').fill(data.email)
    await this.page.getByLabel('件名').fill(data.subject)
    await this.page.getByLabel('メッセージ').fill(data.body)
    await this.page.getByRole('button', { name: '送信する' }).click()
  }

  /** 送信完了メッセージが表示されていることを確認する */
  async expectSuccess() {
    await expect(this.page.getByText('送信完了')).toBeVisible()
  }
}
```

```typescript
// e2e/pages/contact.spec.ts
import { test, expect } from '@playwright/test'
import { ContactPage } from '../fixtures/pages/contact-page'

test.describe('お問い合わせページ', () => {
  test('フォームを送信すると完了メッセージが表示されること', async ({ page }) => {
    // ## Arrange ##
    const contactPage = new ContactPage(page)
    await contactPage.goto()

    // ## Act ##
    await contactPage.fillAndSubmit({
      name: 'テスト太郎',
      email: 'test@example.com',
      subject: 'テストの件名',
      body: 'テストメッセージの内容です。',
    })

    // ## Assert ##
    await contactPage.expectSuccess()
  })
})
```

### 3.4. API モックの活用

外部 API への依存を排除してテストを安定させます。

```typescript
// API レスポンスをモックして UI のテストに集中
await page.route('**/api/contact', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true }),
  })
})
```

### 3.5. テスト命名規則

日本語でテスト名を記述します（プロジェクト憲法に従う）。

```typescript
test.describe('ヘッダーナビゲーション', () => {
  test('デスクトップで全ナビリンクが表示されること', async ({ page }) => { })
  test('600px 以下でハンバーガーメニューが表示されること', async ({ page }) => { })
  test('ハンバーガーメニューをクリックするとパネルが開くこと', async ({ page }) => { })
})
```

## 4. HonoX 特有の考慮事項

### 4.1. Islands の動作確認

Islands コンポーネント（ThemeToggle, MobileMenu など）はクライアントサイドのハイドレーション後に動作します。
Playwright は JS 実行後の DOM を評価するため、**Islands のインタラクションテストに最適**です。

```typescript
test('テーマトグルをクリックするとダークモードになること', async ({ page }) => {
  await page.goto('/')
  
  // テーマトグルボタンをクリック
  await page.getByRole('button', { name: 'ダークモードに切り替え' }).click()
  
  // html 要素の data-theme 属性が変化することを確認
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
```

### 4.2. レスポンシブテスト

モバイルと デスクトップのプロジェクトを使い分けます。

```typescript
// e2e/components/header.spec.ts
test.describe('ヘッダー - モバイル', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('ハンバーガーボタンが表示されること', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'メニューを開く' })).toBeVisible()
  })

  test('ハンバーガーメニューを開くとナビリンクが表示されること', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'メニューを開く' }).click()
    await expect(page.getByRole('navigation', { name: 'モバイルナビゲーション' })).toBeVisible()
  })
})
```

## 5. CI 設定

```yaml
# .github/workflows/e2e.yml
- name: Playwright のブラウザをインストール
  run: npx playwright install chromium --with-deps

- name: E2E テストを実行
  run: npx playwright test

- name: テストレポートをアップロード
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 6. デバッグ

```bash
# インスペクターモードで特定テストをデバッグ
npx playwright test e2e/pages/contact.spec.ts --debug

# トレースを有効化して実行
npx playwright test --trace on

# レポートを表示
npx playwright show-report
```

## 7. 参照

- [Playwright Best Practices（公式）](https://playwright.dev/docs/best-practices)
- [Playwright Configuration（公式）](https://playwright.dev/docs/test-configuration)
- [Playwright Locators（公式）](https://playwright.dev/docs/locators)
- [Page Object Models（公式）](https://playwright.dev/docs/pom)
