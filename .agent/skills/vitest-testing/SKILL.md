---
name: vitest-testing
description: HonoX環境における Vitest ユニットテストのベストプラクティス。対象は `.ts` ファイル（サービス・フック・ユーティリティ）のみ。ページ（.tsx）は Playwright が担当。カバレッジ100%を目標とし、TDD サイクルを実践する。
---

# Vitest-Testing スキル

HonoX アプリケーションにおける **ロジック層（`.ts` ファイル）のユニットテスト**ガイド。

## 1. 担当範囲（重要）

Vitest がテストするのは **`.ts` 拡張子のファイルのみ**です。

| 対象 | ファイル例 |
|---|---|
| ✅ サービス | `src/features/blog/services.ts` |
| ✅ カスタムフック | `app/hooks/use-theme.ts` |
| ✅ ユーティリティ | `src/utils/date.ts` |
| ❌ ページコンポーネント | `app/routes/index.tsx` → **Playwright が担当** |
| ❌ 定数 | `src/constants/site.ts` → **テスト不要** |
| ❌ 型定義 | `src/types/*.ts` → **テスト不要** |

## 2. 原則

- **Test-Driven Development (TDD)**: 実装コードを書く前に、必ず失敗するテストを書く。
- **Coverage 100%（.ts 対象ファイルのみ）**: ステートメント・ブランチ・関数・ラインをすべて網羅。
- **Fast Feedback Loop**: Vitest の高速ランナーで瞬時に結果を得る。
- **ロンドン学派**: 外部依存（DB、API）はモック化して対象ロジックを隔離する。

## 3. ベストプラクティス

### 3.1. Hono `app.request` による API の統合テスト

**注意**: `app.request` は API エンドポイント（`/api/*`）のテストにのみ使用します。ページ（`/`, `/contact` 等）への HTTP リクエストは Playwright に委譲してください。

```typescript
import { test, expect } from 'vitest'
import app from '../app/server'

test('POST /api/contact：正常な入力で 200 を返すこと', async () => {
  // ## Arrange ##
  const body = {
    senderName: 'テスト太郎',
    senderEmail: 'test@example.com',
    subject: '件名',
    body: 'メッセージ',
  }

  // ## Act ##
  const res = await app.request('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  // ## Assert ##
  expect(res.status).toBe(200)
})
```

### 3.2. サービス層のユニットテスト

```typescript
import { describe, expect, it, vi } from 'vitest'
import { blogService } from '../services'

/**
 * blogService のユニットテスト。
 * DB クライアントをモック化し、サービスのロジックのみを検証する。
 */
describe('blogService', () => {
  it('getPostById()：存在するIDで記事を返すこと', async () => {
    // ## Arrange ##
    const mockPost = { slug: 'test', title: 'テスト記事', excerpt: '...' }
    vi.spyOn(db, 'query').mockResolvedValueOnce([mockPost])

    // ## Act ##
    const result = await blogService.getPostById('test')

    // ## Assert ##
    expect(result).toEqual(mockPost)
  })

  it('getPostById()：存在しないIDで null を返すこと', async () => {
    // ## Arrange ##
    vi.spyOn(db, 'query').mockResolvedValueOnce([])

    // ## Act ##
    const result = await blogService.getPostById('non-existent')

    // ## Assert ##
    expect(result).toBeNull()
  })
})
```

### 3.3. カスタムフックのユニットテスト

`app/hooks/` 以下のカスタムフックは、ブラウザ API（`localStorage`, `document` 等）をモック化してテストします。

```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useTheme } from '../use-theme'

/**
 * useTheme フックのユニットテスト。
 * localStorage をモック化してブラウザ依存を排除する。
 */
describe('useTheme', () => {
  beforeEach(() => {
    // localStorage のモック
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    })
  })

  it('初期状態でシステムのカラースキームを参照すること', () => {
    // ## Arrange ##
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true, // dark モード
    } as MediaQueryList)

    // ## Act & Assert ##
    // フックのロジック（純粋関数に切り出した部分）をテスト
    expect(getEffectiveTheme()).toBe('dark')
  })
})
```

### 3.4. ユーティリティのユニットテスト

```typescript
import { describe, expect, it } from 'vitest'
import { formatDate } from '../date'

/**
 * formatDate ユーティリティのユニットテスト。
 */
describe('formatDate', () => {
  it('Date オブジェクトを日本語表記にフォーマットすること', () => {
    // ## Arrange ##
    const date = new Date('2025-02-25')

    // ## Act ##
    const result = formatDate(date)

    // ## Assert ##
    expect(result).toBe('2025年2月25日')
  })

  it('境界値：Unix エポック（1970-01-01）を正しくフォーマットすること', () => {
    expect(formatDate(new Date(0))).toBe('1970年1月1日')
  })
})
```

## 4. カバレッジ設定（vitest.config.ts）

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // .ts ファイルのみをテスト対象とし、.tsx は除外
    include: ['**/*.test.ts'],
    exclude: ['**/*.test.tsx', 'node_modules/**', 'e2e/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      // .ts ファイルのみカバレッジ計測
      include: ['src/**/*.ts', 'app/hooks/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/tests/**',
        // 定数・型はカバレッジ対象外
        'src/constants/**',
        'src/types/**',
        // エントリーポイント・設定ファイル
        'app/client.ts',
        'app/server.ts',
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
```

## 5. TDD サイクル

1. **Red**: 満たすべき仕様をテストに書き、テストを失敗させる。
2. **Green**: テストをパスさせるための「最小限」の実装を書く。
3. **Refactor**: テストが通る状態を維持しつつ、コードを整理・最適化する。
4. **Confirm**: `npx vitest run --coverage` でカバレッジが100%であることを確認する。

## 6. 参照

- [Vitest Documentation](https://vitest.dev/)
- [Hono Testing Helper](https://hono.dev/docs/guides/testing)
- [testing-best-practices スキル](../testing-best-practices/SKILL.md)
- [playwright-e2e スキル](../playwright-e2e/SKILL.md)
