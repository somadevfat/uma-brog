---
name: honox-drizzle-fullstack
description: HonoX, Drizzle ORM, Cloudflare D1 を用いた実用的で高速なフルスタック開発スキル。
---

# HonoX + Drizzle Fullstack スキル

このスキルは、DDDやクリーンアーキテクチャなどの過剰な抽象化を避け、HonoXとDrizzleのポテンシャルを最大限に引き出すための開発ガイドです。

## 1. ディレクトリ構造

```text
src/
├── app/                  # ルーティングとIslands (Presentation)
├── db/                   # スキーマ定義とクライアント (Core)
├── features/             # 機能ごとのサービスと型 (Logic)
├── components/           # 共有UIコンポーネント (Pure JSX)
└── lib/                  # 共通基盤 (Auth等)
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
export default createRoute(async (c) => {
  const posts = await blogService.getAllPosts();
  return c.render(<PostList posts={posts} />);
});
```

## 3. 実装のルール

1.  **NO DDD**: エンティティやバリューオブジェクトの複雑なクラス定義は行わない。
2.  **Schema First**: 型は `drizzle-orm` の `InferSelectModel` 等を使用してスキーマから自動生成する。
3.  **Hono RPC**: 同一プロジェクト内でも、APIルートは `hono/client` で型安全に呼び出せるように構築する。
4.  **Islands**: ステート管理が必要な場合のみ `islands/` を使用する。

## 4. 品質管理

- **Vitest**: サービスレイヤーのクエリロジックを中心に実用的なテストを書く。
- **Type Safety**: `drizzle-zod` を使って、バリデーションとDBスキーマを一致させる。
