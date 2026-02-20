---
name: hono-backend-ddd
description: HonoX環境におけるDDD (Domain-Driven Design) をベースにした堅牢なバックエンド開発スキル。
---

# Hono-Backend-DDD スキル

このスキルは、HonoX, Drizzle ORM, Cloudflare D1, Zod を組み合わせ、DDD原則に基づいた堅牢なバックエンドを構築するためのガイドです。

## 1. ディレクトリ構成 (DDDアーキテクチャ)

ビジネスロジックを中心に据え、技術的詳細（DB、外部API）を外側に配置します。

```text
src/
├── app/                  # HonoX ファイルベースルーティング
└── context/             # 各ドメインコンテキスト
    └── [context-name]/
        ├── domain/       # エンティティ、値オブジェクト、リポジトリ抽象
        ├── application/  # ユースケース、DTO
        ├── infrastructure/ # リポジトリの実装、Drizzleスキーマ
        └── presentation/ # Honoレンダラー(routesから呼び出される)
```

## 2. ベストプラクティス

### 2.1. 型安全なバリデーション (Zod)

`@hono/zod-validator` を使用し、エンドポイントの入り口で型を確定させます。

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const postRouter = factory.createHandlers(
  zValidator("json", schema),
  async (c) => {
    const data = c.req.valid("json");
    // 以降、data は型安全
  },
);
```

### 2.2. Drizzle ORM + Cloudflare D1

- データベースクライアントは `lib/db/` で一元管理。
- D1のバインディングは `c.env.DB` を通じて渡します。

```typescript
// src/lib/db/client.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const createDb = (d1: D1Database) => {
  return drizzle(d1, { schema });
};
```

### 2.3. DDDの分離

- **Infrastructure層**: Drizzleの `schema` 定義や SQL クエリを記述。
- **Domain層**: DBの知識を一切持たないビジネスロジックのみを記述。
- **Application層**: 複数のRepositoryを組み合わせてビジネス価値を提供。

## 3. TDDへの統合

- 全てのApplication Service/Domain Serviceに対し、テストを先に書く。
- インフラ層（Repository）のモック化を容易にするため、依存性注入（DI）を検討する。

## 4. 参照

- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
