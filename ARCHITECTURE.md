# Portfolio Blog Architecture (HonoX + Drizzle)

## 1. コンセプト

本プロジェクトは、**HonoX** と **Drizzle ORM** を組み合わせ、Cloudflare D1 などのエッジ環境で「最速かつ最小」なフルスタック構成を目指します。
過剰な抽象化（DDD やクリーンアーキテクチャ）を排除し、**機能性・型安全性・開発速度**を最優先した「実用的」な設計を採用します。

## 2. ディレクトリ構造

`src/` 配下を役割ごとに整理し、Drizzle スキーマをプロジェクトの「唯一の真実（Single Source of Truth）」とします。

```text
app/                        # 【HonoX Root】ルーティングと Islands
├── routes/                 # SSRされるページ・APIルート
│   ├── _renderer.tsx       # レイアウト定義（HTML シェルと共通ヘッダーの統合）
│   ├── _middleware.ts      # 認証などのグローバルミドルウェア
│   ├── _404.tsx / _error.tsx
│   ├── index.tsx           # / (ホーム)
│   ├── contact.tsx         # /contact
│   ├── portfolio.tsx       # /portfolio
│   ├── blog/               # /blog/*
│   ├── admin/              # /admin/*
│   ├── api/                # /api/* (Hono RPC エンドポイント)
│   └── tests/              # ルートの統合テスト
├── islands/                # 【Islands】クライアントサイド JS (Hydration 部品)
│   ├── theme-toggle.tsx    # テーマ切り替え
│   ├── mobile-menu.tsx     # ハンバーガーメニュー（レスポンシブ）
│   ├── search-list.tsx     # 検索・フィルタ機能付きリスト
│   └── contact-form.tsx    # お問い合わせフォーム
├── hooks/                  # 【Island 専用カスタムフック】クライアント API を使うフック
│   └── use-*.ts            # 例: use-theme.ts, use-mobile-menu.ts
├── server.ts               # Hono アプリのエントリーポイント
├── client.ts               # クライアントサイドのエントリーポイント
└── style.css               # グローバルスタイル（CSS Variables + Responsive）

src/
├── constants/              # 【Constants】サイト名・ページネーション数などの固定値
├── utils/                  # 【Utilities】日付フォーマットなどの純粋関数（外部依存なし）
├── hooks/                  # 【Shared Hooks】SSR 側でも安全に使えるフック（ブラウザAPI不使用）
├── lib/                    # 【Libraries】外部 SDK・DB 初期化のラッパー（外部依存あり）
│   └── auth/               # Better Auth 設定
├── types/                  # 【Global Types】プロジェクト共通の型定義
├── features/               # 【Features】機能単位のビジネスロジックと専用 UI
│   ├── blog/               # services.ts / types.ts / post-list.tsx / tests/
│   ├── portfolio/          # services.ts / types.ts / project-grid.tsx / tests/
│   ├── contact/            # services.ts / tests/
│   ├── analytics/          # services.ts / tests/
│   └── admin/              # services.ts
├── components/             # 【Shared UI】共通コンポーネント（SSR のみ、Pure JSX）
│   ├── ui/                 # 原子レベルの最小部品（ContentCard, ContentGrid など）
│   ├── layout/             # 全体枠（HtmlShell など）
│   └── system/             # システム部品（ErrorPage など）
├── db/                     # 【Database Core】Drizzle スキーマ・クライアント
│   ├── schema/             # テーブル定義（Single Source of Truth）
│   └── client.ts           # Drizzle クライアントの初期化
└── content/                # 【Static Content】MDX ファイル等
```

## 3. hooks / utils / constants の分離方針

ロジックを Island コンポーネントに直書きせず、以下の 3 層に分離することで**機能を一目で把握できる**状態を維持します。

### 3.1. `app/hooks/` — Island 専用カスタムフック

**使用場所**: `app/islands/` からのみインポートする。  
**禁止**: `src/` 側（SSR）からのインポート禁止（`localStorage` / `document` などのブラウザ API が含まれるため）。

```text
app/hooks/
├── use-theme.ts          # テーマの取得・切り替えロジック
├── use-mobile-menu.ts    # メニューの開閉・ESCキー・スクロールロック
└── use-search.ts         # 検索クエリ・タグフィルタの状態管理
```

例：

```ts
// app/hooks/use-theme.ts
import { useEffect, useState } from 'hono/jsx'

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // ... localStorage / matchMedia を使うロジック
  return { theme, toggle }
}
```

### 3.2. `src/hooks/` — SSR 安全なカスタムフック

ブラウザ API を使わず、Server / Client 両側で安全に再利用できるフック。  
例：ページネーションロジック、データ変換フックなど。

### 3.3. `src/utils/` — 純粋関数ユーティリティ

副作用・外部依存なし。引数 → 戻り値のみ。

```text
src/utils/
├── date.ts        # 日付フォーマット
├── string.ts      # 文字列加工
└── url.ts         # スラッグ生成など
```

### 3.4. `src/constants/` — 固定値の一元管理

```text
src/constants/
├── site.ts        # サイト名・説明文・OGP など
└── nav.ts         # ナビリンク定義
```

## 4. 実装のベストプラクティス

### 4.1. Drizzle Schema-First & Zod Integration (DRY)

`drizzle-zod` を使用し、DB スキーマからバリデーション・ロジックを自動生成します。DB の変更がバリデーションに即座に反映される状態を維持します。

### 4.2. Full-stack Type Safety via Hono RPC

フロントエンドと API 間の通信には、必ず **Hono RPC (`hc`)** を活用します。URL 文字列の直接記述は禁止です。

### 4.3. 責任の分離 (SRP)

| 層 | 責任 |
|---|---|
| `app/routes/` | リクエスト受け取り → レスポンス返却のみ |
| `src/features/*/services.ts` | DB 操作・ビジネスロジック |
| `app/islands/` | UI の状態とインタラクションのみ（ロジックは hooks に委譲） |
| `app/hooks/` | Island のクライアントロジック（状態・副作用） |
| `src/utils/` | 純粋関数（副作用なし） |
| `src/constants/` | 固定値の一元管理 |

### 4.4. Islands Architecture の原則

- **デフォルト SSR**: すべてサーバーサイドでレンダリング。
- **Island は最小限**: `useState` / `useEffect` が必要な部分のみ Island にする。
- **ロジック分離**: Island コンポーネントは UI の記述に集中し、ロジックは `app/hooks/` に切り出す。
- **Island からロジックを import するのは `app/hooks/` のみ**（`src/hooks/` を Island に混入しない）。

### 4.5. テスト戦略（Playwright / Vitest の責務分担）

| テスト対象 | ツール | 配置場所 |
|---|---|---|
| ページ・UI インタラクション（`.tsx` ルート） | **Playwright** | `e2e/` |
| ビジネスロジック・フック・ユーティリティ（`.ts`） | **Vitest** | 実装隣接 `tests/` |
| 定数（`src/constants/`） | **対象外** | — |
| 型定義（`src/types/`） | **対象外** | — |

- **Playwright**: 実ブラウザで Islands のハイドレーション・レスポンシブ挙動・フォーム送信を検証。
- **Vitest**: 外部依存をモック化して `.ts` ファイルのロジックを高速・精密に検証。カバレッジ100%を目標。
- **定数・型**: ランタイムの振る舞いがなく、TypeScript コンパイルチェックで十分。

### 4.6. Biome によるコード品質の維持

ESLint/Prettier の代わりに **Biome** を採用。`any` 禁止・命名規則を厳格に管理。

## 5. 開発サイクル

1. **Schema**: `src/db/schema/` にテーブル定義を追加。
2. **Migration**: `bun run db:generate` & `bun run db:migrate`。
3. **Service**: `src/features/[feature]/services.ts` にビジネスロジックを TDD で実装。
4. **Vitest**: `tests/*.test.ts` でサービス・ユーティリティのユニットテストを書く。
5. **Hook（Island 用）**: `app/hooks/use-*.ts` にクライアントロジックを実装・テスト。
6. **Island**: `app/islands/` で hooks を組み合わせて UI を構築。
7. **Presentation**: `app/routes/` で Service と Island を結合。
8. **Playwright**: `e2e/` にページ単位の E2E テストを書く。

---

このアーキテクチャは DRY / SRP を徹底し、**Playwright × Vitest の明確な役割分担**と **hooks・utils・constants の分離**によって、機能の所在を常に把握できるコードベースを実現します。
