---
name: better-auth
description: Better Auth を HonoX / Cloudflare D1 環境で安全に使用するためのスキル。
---

# Better-Auth スキル

このスキルは、モダンで堅牢な認証ライブラリである Better Auth を、HonoX と Cloudflare D1 に統合するためのガイドです。

## 1. 概要

Better Auth はフレームワークに依存しない認証フレームワークで、Drizzle ORM との相性が非常に良く、エッジ（Cloudflare）環境でも高速に動作します。

## 2. ベストプラクティス

### 2.1. スキーマ定義 (Infrastructure)

Drizzle でユーザーやセッションのテーブルを定義し、Better Auth の要件に合わせます。

```typescript
// src/lib/db/auth-schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // ... better-auth 既定のフィールド
});
```

### 2.2. クライアント初期化

Hono の Context (`c.env`) を利用して、動的に認証クライアントを設定します。

```typescript
// src/lib/auth/client.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "../db/client";

export const getAuth = (env: Env) => {
  const db = createDb(env.DB);
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    // ... その他のプラグイン
  });
};
```

### 2.3. Hono Middleware への統合

リクエストごとにユーザー情報を取得し、Context にセットするカスタムミドルウェアを作成します。

```typescript
// src/lib/auth/middleware.ts
export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) {
    c.set("user", session.user);
  }
  await next();
});
```

## 3. セキュリティ要件

- **HTTPS**: Cloudflare 環境では標準で提供されます。
- **Environment Variables**: `BETTER_AUTH_SECRET` などの機密情報は `wrangler.toml` または `.dev.vars` で管理。
- **CSRF**: Better Auth 自身の保護機能に加え、Hono の `csrf` ミドルウェアを併用。

## 4. 参照

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth + Drizzle Guide](https://www.better-auth.com/docs/adapters/drizzle)
