---
name: vitest-testing
description: HonoX環境におけるTDD (Test-Driven Development) とカバレッジ80%以上を達成するためのパフォーマンステストスキル。
---

# Vitest-Testing スキル

このスキルは、HonoXアプリケーションにおいてTDDを実践し、信頼性の高いコードを維持するためのテスト戦略ガイドです。

## 1. 原則

- **Test-Driven Development (TDD)**: 実装コードを書く前に、必ず失敗するテストを書く。
- **Coverage > 80%**: ステートメント、ブランチ、関数すべてのカバレッジを80%以上に保つ。
- **Fast Feedback Loop**: Bunの高速なテストランナーとVitestを組み合わせ、瞬時に結果を得る。

## 2. ベストプラクティス

### 2.1. Hono `app.request` による結合テスト

実際のHTTPリクエストをシミュレートし、ルーティングとハンドラーの動作を一括で検証します。

```typescript
import { test, expect } from "vitest";
import app from "../src/index";

test("GET /posts returns 200", async () => {
  const res = await app.request("/posts");
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
});
```

### 2.2. カバレッジの設定 (vitest.config.ts)

V8またはIstanbulを使用して、精度高くカバレッジを計測します。

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // または 'istanbul'
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      exclude: ["node_modules/", "dist/", "**/*.d.ts"],
    },
  },
});
```

### 2.3. D1/Drizzle のモック・テスト環境

- ローカルテスト時は `better-sqlite3` や `miniflare` を用いて、実際のSQLiteデータベースに対してテストを実行。
- `beforeEach` で各テストの前にテーブルをリセット（クリーンアップ）する。

## 3. TDDサイクル

1. **Red**: 満たすべき仕様をテストに書き、テストを失敗させる。
2. **Green**: テストをパスさせるための「最小限」の実装を書く。
3. **Refactor**: テストが通る状態を維持しつつ、コードを整理・最適化（DDDへの適合）する。
4. **Confirm**: テストを通ることを確認する。

## 4. 参照

- [Vitest Documentation](https://vitest.dev/)
- [Hono Testing Helper](https://hono.dev/docs/guides/testing)
