---
name: honox-drizzle-fullstack
description: HonoX, Drizzle ORM, Cloudflare D1 を用いた実用的で高速なフルスタック開発スキル。
---

# HonoX + Drizzle Fullstack スキル

このスキルは、DDDやクリーンアーキテクチャなどの過剰な抽象化を避け、HonoXとDrizzleのポテンシャルを最大限に引き出すための開発ガイドです。

## 1. ディレクトリ構造

```text
src/
├── app/                  # ルーティング (Presentation)
├── db/                   # スキーマ定義とクライアント (Core)
├── features/             # 機能ごとのサービスとUI (Logic)
├── components/           # 共有UI (layout, system, ui)
└── lib/                  # 共通基盤
```

## 2. 開発フロー (Direct Path)

### 2.1. スキーマ定義 (Single Source of Truth)

`src/db/schema/` 内にテーブルを定義します。

```typescript
// src/db/schema/posts.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
});
```

### 2.2. サービスレイヤーの実装

`src/features/[feature]/services.ts` にクエリを集約します。

```typescript
// src/features/blog/services.ts
import { db } from "../../db/client";
import { posts } from "../../db/schema/posts";

export const blogService = {
  async getAllPosts() {
    return await db.select().from(posts).all();
  },
};
```

### 2.3. ルーティング (SSR)

`app/routes/` でサービスを呼び出し、UIをレンダリングします。

```tsx
// app/routes/blog/index.tsx
export const GET = createRoute(async (c) => {
  const posts = await blogService.getAllPosts();
  return c.render(<PostList posts={posts} />);
});

// RPC用の型エクスポート（Single Routeの場合）
export type AppType = typeof GET;
```

## 3. 実装のルール

1.  **NO DDD**: クラスによる過剰な抽象化は行わず、Service関数でシンプルに実装する。
2.  **Schema First & Zod (DRY)**: `drizzle-zod` を活用し、DBスキーマをバリデーションの唯一のソースとする。
3.  **Separation of Concerns (SRP)**: ルート、サービス、レイアウト、UIコンポーネントの責務を明確に分ける。
4.  **Layout Logic**: `_renderer.tsx` はシェルの呼び出しに徹し、メタデータは動的に管理する。
5.  **Islands**: クライアントサイドの挙動が必要な最小限の範囲のみで使用する。
6.  **Full Type Sharing (Hono RPC)**:
    - フロントエンドと API 間の通信は必ず Hono RPC (`hc`) を利用する。
    - API 側（`app/routes/api/` 等）で `export type AppType = typeof route` を行い、フロント側でこれをインポートして `hc<AppType>` を作成する。
    - URL 文字列の直接記述による `fetch` は禁止。
    - バリデーション用の Zod スキーマ（`src/db/schema/` 内）をフロントエンドでも共有し、入力側の型安全も確保する。

## 4. 品質管理

- **Vitest**: サービスレイヤーのクエリロジックを中心に実用的なテストを書く。
- **Type Safety**: `drizzle-zod` を使って、バリデーションとDBスキーマを一致させる。
- **Biome**: Linter/Formatter として使用。`bun run lint`, `bun run fmt` でコードの品質を均一化し、`any` を排除する。
