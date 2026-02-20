# Portfolio Blog Architecture (HonoX + DDD + TDD)

## 1. 全体アーキテクチャ設計

本プロジェクトは、**HonoX** をベースに、**Domain-Driven Design (DDD)** の考え方を階層として取り入れ、**Test-Driven Development (TDD)** で品質を保証するフルスタック・アーキテクチャを採用します。

### 1.1. レイヤード構造

`src/` 配下を以下の役割で分離します。

| レイヤー           | ディレクトリ                      | 役割                                                                          |
| :----------------- | :-------------------------------- | :---------------------------------------------------------------------------- |
| **Routing**        | `src/app/`                        | HonoXのファイルシステムルーティング。全リクエストの入り口。                   |
| **Domain Context** | `src/features/`                   | 業務知識。機能単位（ブログ, 認証, プロフィール等）でディレクトリを分ける。    |
| **Application**    | `src/features/*/application/`     | ユースケース。複数のRepositoryやDomain Serviceを調整して目的を達成。          |
| **Domain**         | `src/features/*/domain/`          | ビジネスルール。Entities, Value Objects, Repositoryのインターフェースを定義。 |
| **Infrastructure** | `src/features/*/infrastructure/`  | 技術的詳細。DBスキーマ(Drizzle), ReposImpl, 外部APIクライアント。             |
| **UI Layer**       | `src/components/`, `src/islands/` | 表示とインタラクション。基本はサーバーサイド(SSR)。                           |

## 2. ディレクトリ構造の詳細

```text
.
├── .agent/               # AIエージェント用設定・スキル
├── src/
│   ├── app/              # HonoX Routes (SSR ページ)
│   │   ├── routes/
│   │   └── client.ts
│   ├── features/         # ドメイン駆動の機能単位
│   │   ├── blog/         # ブログドメイン
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   └── auth/         # 認証ドメイン
│   ├── lib/              # 共通基盤・外部ツール設定
│   │   ├── db/           # Drizzle & Cloudflare D1
│   │   └── auth/         # Better Auth 設定
│   ├── components/       # 共有サーバーコンポーネント (Pure JSX)
│   ├── islands/          # 共有クライアントコンポーネント (Islands)
│   └── index.css         # グローバルデザインシステム
├── tests/                # ユニット・統合テスト (Vitest)
├── wrangler.toml         # Cloudflare設定
├── drizzle.config.ts     # DBマイグレーション設定
└── TECH_STACK.md         # 技術選定書
```

## 3. 品質戦略

### 3.1. TDDサイクル

全てのビジネスロジックは、`tests/` 配下のテストコードが「先行」して作成されます。

### 3.2. カバレッジ指標

- **Statement/Branch/Function Coverage**: 80%以上を必須。
- Vitestによる継続的な監視。

### 3.3. 型の安全性

- **Schema First**: Drizzleでテーブル定義を行い、それをZodに変換。
- **No Any**: TypeScriptの `strict` モードを有効化し、`any` を排除。

---

本アーキテクチャは、HonoXの柔軟性とDDDの堅牢性を融合させ、長期的な保守性と最高水準のパフォーマンスを提供します。
