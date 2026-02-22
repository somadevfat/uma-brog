---
description: Users can build high-quality, full-stack applications with zero intervention by following this TDD workflow using Bun.
---

// turbo-all

# TDD 高速自律開発ワークフロー (`tdd-fast`)

このワークフローは、ユーザーからの要求を受けた後、エージェントが自律的にスキーマ設計、テスト、実装、品質検証（Build/Lint）を完結させるためのものです。DDD（ドメイン駆動設計）などの過剰な抽象化を排除し、速度と型安全性を最優先します。

## 1. 準備とコンテキスト把握

1. `TECH_STACK.md` と `ARCHITECTURE.md` を読み込み、プロジェクトの原則を再確認する。
2. ユーザー要求を分析し、必要な `features/` の追加や変更を特定する。
3. `skill-creator`, `honox-drizzle-fullstack`, `honox-frontend`, `vitest-testing`, `better-auth` の関連スキルを確認する。

## 2. スキーマ設計 (Schema-First Phase)

1. `src/db/schema/` に必要なテーブル定義を追加・修正する。
2. `drizzle-zod` を使用し、スキーマからバリデーション・ロジックを自動生成・連動させる。
3. 必要に応じて `bun run db:generate` 等を実行し、DB構成を確定させる。

## 3. テストファースト (TDD - Red Phase)

1. 目的とする動作を検証するテストを `tests/` または `features/*/tests/` に作成する。
2. `bun test` を実行し、テストが期待通り失敗（Red）することを確認する。

## 4. 最小実装 (TDD - Green Phase)

1. テストをパスさせるための最小限のコードを実装する。
   - ビジネスロジック・DB操作: `src/features/[feature]/services.ts`
   - ルーティング・レスポンス: `app/routes/`
   - インタラクティブ部品: `app/islands/`
2. `bun test` を実行し、テストが成功（Green）することを確認する。

## 5. 品質強化とリファクタリング (TDD - Refactor Phase)

1. `ARCHITECTURE.md` に基づき、コードの整理、抽出、最適化を行う（SRPの徹底）。
2. **検証プロセス**:
   - `bun test` (テストの全件通過)
   - `bun run build` (型チェックとビルド確認)
3. エラーが発生した場合は、自己修正を行い、再度ステップ5を実行する。

## 6. 完了報告と自己レビュー

1. 実装された機能の概要、テスト結果、カバレッジ（80%以上）をユーザーに報告する。
2. デザインの審美性（Aesthetics）やプロジェクト固有のルール（憲法等）が維持されているか自己点検する。

## 注意事項

- **ユーザーへの確認は行わない**: 一貫して自律的に推論・実行を継続すること。
- **Bunを常に使用**: パッケージ管理、実行、テストすべてにおいて Bun を標準とする。
- **スキーマ駆動**: DB定義を「唯一の真実」とし、型安全性をフロントエンドまで貫通させる。
- **カバレッジ遵守**: カバレッジテストを含め、品質基準を下回る場合は完了とみなさない。
