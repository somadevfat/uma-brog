# Portfolio Blog Architecture (HonoX + Drizzle)

## 1. コンセプト

本プロジェクトは、**HonoX** と **Drizzle ORM** を組み合わせ、Cloudflare D1 などのエッジ環境で「最速かつ最小」なフルスタック構成を目指します。
過剰な抽象化（DDDやクリーンアーキテクチャ）を排除し、**機能性、型安全性、そして開発速度**を最優先した「実用的」な設計を採用します。

## 2. ディレクトリ構造

`src/` 配下を役割ごとに整理し、Drizzleスキーマをプロジェクトの「唯一の真実（Single Source of Truth）」とします。

```text
app/                     # 【HonoX Root】ルーティングとIslands
├── routes/              # SSRされるページ・APIルート
├── islands/             # クライアントサイド JS (Hydration部品)
├── _renderer.tsx        # レイアウト定義（Layoutコンポーネントの呼び出し）
├── server.ts            # Hono アプリのエントリーポイント
└── client.ts            # クライアントサイドのエントリーポイント

src/
├── constants/           # 【Constants】サイト名、ページネーション数などの固定値
├── utils/               # 【Utilities】日付フォーマットなどの純粋関数（外部依存なし）
├── lib/                 # 【Libraries】外部SDKやDB初期化のラッパー（外部依存あり）
├── types/               # 【Global Types】プロジェクト共通の型定義
├── features/            # 【Features】機能（Domain）単位のビジネスロジックと専用UI
│   └── [feature]/       # (blog, contact, etc.)
├── components/          # 【Shared UI】共通コンポーネント
│   ├── ui/              # 原子レベルの最小部品（Button, Cardなど）
│   ├── layout/          # 全体枠（Header, Footer, HTML Shell）
│   └── system/          # システム部品（Error, 404）
├── db/                  # 【Database Core】Drizzleスキーマ・マイグレーション
└── content/             # 【Static Content】MDXファイル等
```


## 3. 実装のベストプラクティス（プログラミング品質）

### 3.1. Drizzle Schema-First & Zod Integration (DRY)

`drizzle-zod` を使用し、DBスキーマからバリデーション・ロジックを自動生成します。DBの変更がバリデーションに即座に反映される状態を維持します。

### 3.2. 責任の分離 (SRP)

- **`app/routes/`**: リクエストの受け取りと最終的なレスポンス（render/json）の返却のみを担当。
- **`services.ts`**: DB操作やビジネスロジックを担当。
- **`components/layout/`**: HTMLの構造やメタデータ管理を担当。

### 3.3. レイアウトとメタデータの動的管理

`_renderer.tsx` は直接的な実装を避け、`src/components/layout/` に定義されたコンポーネントを呼び出す形式にします。ページごとのタイトルやメタデータは、`c.render` の引数を通じて動的に制御します。

### 3.4. エラーハンドリングの集約

`_error.tsx` や `_404.tsx` は、`src/components/system/` に定義された共通のUIを呼び出すのみとし、エラー発生時の振る舞いを一元管理します。

### 3.5. Biome によるコード品質の維持 (Fast Tooling)

ESLint/Prettier の代わりに **Biome** を採用し、爆速な Linter/Formatter 環境を構築しています。`any` の使用禁止や命名規則などを厳格に管理し、常にクリーンなコードベースを維持します。

## 4. 開発サイクル

1.  **Schema**: `src/db/schema/` にテーブル定義を追加。
2.  **Migration**: `bun run db:generate` & `bun run db:migrate`。
3.  **Service**: `src/features/[feature]/services.ts` にビジネスロジックを、同ディレクトリに専用UIを実装。
4.  **Presentation**: `app/routes/` でこれらを結合。

---

このアーキテクチャは、プログラミング原則（DRY/SRP）を徹底することで、スケールしても「汚れない」コードベースを実現します。
