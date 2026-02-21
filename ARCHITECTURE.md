# Portfolio Blog Architecture (HonoX + Drizzle)

## 1. コンセプト

本プロジェクトは、**HonoX** と **Drizzle ORM** を組み合わせ、Cloudflare D1 などのエッジ環境で「最速かつ最小」なフルスタック構成を目指します。
過剰な抽象化（DDDやクリーンアーキテクチャ）を排除し、**機能性、型安全性、そして開発速度**を最優先した「実用的」な設計を採用します。

## 2. ディレクトリ構造

`src/` 配下を役割ごとに整理し、Drizzleスキーマをプロジェクトの「唯一の真実（Single Source of Truth）」とします。

```text
src/
├── app/                  # 【Presentation】HonoX 固有の領域
│   ├── routes/           # SSRされるページ・APIルート
│   ├── islands/          # クライアントサイド JS (Hydration部品)
│   ├── _renderer.tsx     # レイアウト定義
│   └── client.ts         # エントリーポイント
│
├── db/                   # 【Database Core】Drizzle 関連
│   ├── schema/           # テーブル定義 (機能ごとに分割)
│   │   ├── index.ts      # すべてを統合して export
│   │   ├── posts.ts
│   │   └── messages.ts
│   └── client.ts         # Drizzle インスタンス初期化
│
├── features/             # 【Feature Logic】機能ごとのロジック集約
│   ├── blog/             # ブログ機能
│   │   ├── services.ts   # Drizzleを用いたデータ取得・操作ロジック
│   │   └── types.ts      # スキーマから推論した型定義
│   └── contact/          # お問い合わせ機能
│       └── services.ts
│
├── components/           # 共有UIコンポーネント (サーバーサイド専用)
├── lib/                  # 共通ユーティリティ (Auth, Helper)
└── content/              # 静的コンテンツ (MDXファイル等)
```

## 3. 実装のベストプラクティス

### 3.1. Drizzle Schema-First

DBスキーマを定義すれば、TypeScriptの型、DBマイグレーション、および `drizzle-zod` によるバリデーションが自動的に整合されます。

### 3.2. Middleware による DB 注入

Cloudflare Workers 環境では `env` を通じて DB にアクセスします。Hono のミドルウェアで `c.set('db', ...)` を行い、Handlerから型安全にアクセス可能にします。

### 3.3. Service Layer によるロジック分離

`features/[feature]/services.ts` に DB クエリや外部連携ロジックをまとめます。これにより、SSRページ (`routes`) と APIエンドポイントの両方から同じロジックを共有できます（DRYの徹底）。

### 3.4. Islands Architecture

インタラクティブな要素（アニメーション、リアルタイムバリデーション等）が必要な場合のみ `islands/` に配置し、JS の配信量を最小限に抑えます。

## 4. 開発サイクル

1.  **Schema**: `src/db/schema/` にテーブル定義を追加。
2.  **Migration**: `bun run db:generate` & `bun run db:migrate`。
3.  **Service**: `src/features/[feature]/services.ts` にロジックを実装。
4.  **Presentation**: `app/routes/` または `app/islands/` でUIを構築。

---

このアーキテクチャは、コードの「散らばり」を抑え、開発者がどこに何を書くべきかを明確にすることで、長期的な保守性と爆速な開発を両立します。
