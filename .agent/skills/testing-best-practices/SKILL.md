---
name: testing-best-practices
description: テストの責務分担（Playwright / Vitest）、AAAパターン、カバレッジ方針、日本語記述ルールを定義します。定数・型定義はテスト対象外。ページ UI は Playwright、ロジック（.ts）は Vitest が担当します。
---

# テストベストプラクティス (Testing Best Practices)

このスキルは、プロジェクトにおけるテストの品質を最高水準に保つためのガイドラインを提供します。
「とりあえず通るテスト」ではなく、「仕様を網羅し、変更に対する自信を与えるテスト」を作成します。

## 1. テストピラミッドと責務分担

```
         ┌──────────────────┐
         │  Playwright E2E  │  ← ページ / UI インタラクション（.tsx ルート）
         └────────┬─────────┘
      ┌───────────┴──────────────┐
      │     Vitest Unit Test     │  ← ロジック・フック・ユーティリティ（.ts のみ）
      └──────────────────────────┘
```

| テスト対象 | ツール | 対象拡張子 |
|---|---|---|
| ページ・UI インタラクション・Islands | **Playwright** | `*.spec.ts`（`e2e/` 以下） |
| ビジネスロジック・サービス・フック・ユーティリティ | **Vitest** | `*.test.ts`（実装隣接 `tests/`） |
| 定数（`src/constants/`）| テスト対象外 | — |
| 型定義（`src/types/`）| テスト対象外 | — |

### 理由

- **ページ（`.tsx`）**: レンダリング・インタラクション・レスポンシブ挙動は、実ブラウザを起動する Playwright で検証するほうが信頼性が高い。
- **ロジック（`.ts`）**: 純粋な関数・サービス・フックは Vitest で高速かつ精密にユニットテストを行う。
- **定数・型**: ランタイムの振る舞いがなく、TypeScript のコンパイルチェックで十分。

## 2. コア原則

1. **カバレッジ100%を基準とする（Vitest 対象の .ts ファイル）**
   - 正常系・異常系・境界値・条件分岐（if/else, switch, 三項演算子）のすべてを網羅。
   - カバレッジ100%は目的ではなく、すべてのコードパスが意図通りであることを証明する手段。
2. **意味のあるテスト (Meaningful Tests)**
   - 単なる関数の実行確認ではなく、ビジネスロジックやドメインの制約を忠実に検証する。
   - エッジケース（空配列、null/undefined、最大値、無効な入力）を積極的に含める。
3. **AAA (Arrange, Act, Assert) パターンの遵守**
   - テストの構造を明確にするため、必ずセクション分けのコメントを記述する。
4. **ロンドン学派（London School）アプローチの採用（Vitest）**
   - ユニットテストでは外部依存（DB、API、他クラス）を積極的にモック化し、対象の振る舞いを隔離する。
5. **ユーザー視点でのテスト（Playwright）**
   - 実装の内部詳細（CSS クラス名、関数名）ではなく、ユーザーが見て・触れる可視要素を基準にアサート。
6. **テストの近接配置 (Colocation)**
   - Vitest テストは実装ファイルと同じ階層の `tests/` に配置。
   - Playwright テストは `e2e/` 以下に集約。
7. **Biome による型安全の担保**
   - テストコードも Biome の静的解析の対象。型エラーや Lint 警告を 0 に保つ。

## 3. テストの構造（AAAパターン）

Vitest・Playwright 共通でこの構造に従います。

```typescript
test('テスト対象：期待される動作の日本語記述', async () => {
  // ## Arrange ##
  // テストデータの準備、モックの設定、依存オブジェクトの初期化など。

  // ## Act ##
  // テスト対象のメソッドや関数を実行。

  // ## Assert ##
  // 結果の検証。expect() を用いて期待値と比較。
})
```

## 4. 日本語記述ルール

プロジェクトの憲法に従い、すべて日本語で記述します。

- **テスト名**: 振る舞いが一目でわかる日本語で記述する。
  - 良い例: `blogService.getPostById()：存在しないIDを指定した場合にNotFoundエラーをスローすること`
  - 良い例: `ハンバーガーメニューを開くとナビリンクが表示されること`
- **JSDoc**: すべてのテストファイル・ヘルパーに日本語で `/** ... */` 形式を記述する。
- **セクションコメント**: 実装ひとまとまりを1行で説明する。
- **any 禁止**: テストコードでも `any` 型の使用は禁止。`unknown` へのキャストを使用する。

## 5. ディレクトリ構成ルール

```text
e2e/                          # Playwright E2E テスト
  pages/
    home.spec.ts              # / ページテスト
    contact.spec.ts           # /contact ページテスト
    portfolio.spec.ts         # /portfolio ページテスト
    blog.spec.ts              # /blog ページテスト
  components/
    header.spec.ts            # ヘッダー・ハンバーガーメニューテスト
  fixtures/
    index.ts                  # 共通フィクスチャ・POM

src/
  features/
    [feature-name]/
      services.ts             # 実装（テスト対象）
      tests/
        services.test.ts      # Vitest テスト

app/
  hooks/
    use-theme.ts              # 実装（テスト対象）
    tests/
      use-theme.test.ts       # Vitest テスト

  # ← routes/*.tsx は Vitest でテストしない（Playwright が担当）
```

## 6. 実装チェックリスト

### Vitest（.ts ロジック）

- [ ] すべての条件分岐 (if, else, ternary) をカバーしているか？
- [ ] 境界値（最小値、最大値、空文字、0）をテストしているか？
- [ ] 外部 API やデータベースの失敗ケースをモックで再現しているか？
- [ ] 非同期処理において競合状態やタイムアウトを考慮しているか？
- [ ] テストデータが他のテストに影響を与えないよう `afterEach` でクリーンアップしているか？

### Playwright（.tsx ページ）

- [ ] ロケーターは `getByRole` / `getByLabel` / `getByText` を優先しているか（CSS クラス禁止）？
- [ ] アサーションは Web First（`toBeVisible()` 等）を使用しているか？
- [ ] モバイルビューポートでのテストを含めているか（レスポンシブ確認）？
- [ ] Islands のインタラクション（クリック・状態変化）を検証しているか？
- [ ] `waitForTimeout` 等の固定待機を使っていないか？

### 共通

- [ ] **Biome チェッカーを実行し、型エラーや Lint 警告が 0 であるか？**
- [ ] タイポや不自然な日本語によるコメント・命名がないか？

## 7. 参照資料

- [playwright-e2e スキル](../playwright-e2e/SKILL.md) - Playwright の詳細ガイド
- [vitest-testing スキル](../vitest-testing/SKILL.md) - Vitest の TDD サイクルと設定
