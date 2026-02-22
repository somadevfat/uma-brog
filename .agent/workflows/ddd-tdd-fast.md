---
description: Users can build high-quality, full-stack applications with zero intervention by following this DDD/TDD workflow using Bun.
---

// turbo-all

# DDD/TDD 高速自律開発ワークフロー (`ddd-tdd-fast`)

このワークフローは、ユーザーからの要求を受けた後、エージェントが自律的にコンテキスト設計、テスト、実装、品質検証（Build/Lint）を完結させるためのものです。

## 1. 準備とコンテキスト把握

1. `TECH_STACK.md` と `ARCHITECTURE.md` を読み込み、プロジェクトの原則を再確認する。
2. ユーザー要求を分析し、必要な `features/` の追加や変更を特定する。
3. `skill-creator`, `hono-backend-ddd`, `honox-frontend`, `vitest-testing`, `better-auth` の関連スキルを確認する。

## 2. ドメイン設計 (DDD Phase)

1. `src/features/[feature-name]/domain/` にエンティティ、値オブジェクト、リポジトリのインターフェースを定義する。
2. ビジネスロジックの核となる部分を抽出する。

## 3. テストファースト (TDD - Red Phase)

1. 目的とする動作を検証するテストを `tests/` または `features/*/tests/` に作成する。
2. `bun test` を実行し、テストが期待通り失敗（Red）することを確認する。

## 4. 最小実装 (TDD - Green Phase)

1. テストをパスさせるための最小限のコードを `features/` および `app/` に実装する。
2. `bun test` を実行し、テストが成功（Green）することを確認する。

## 5. 品質強化とリファクタリング (TDD - Refactor Phase)

1. アーキテクチャに基づき、コードの整理、抽出、最適化を行う。
2. **検証プロセス**:
   - `bun test` (テストの再確認)
   - `bun run build` (型チェックとビルド確認)
3. エラーが発生した場合は、自己修正を行い、再度ステップ5を実行する。

## 6. 完了報告と自己レビュー

1. 実装された機能の概要、テスト結果、カバレッジ（80%以上）をユーザーに報告する。
2. デザインの審美性（Aesthetics）が維持されているか自己点検する。

## 注意事項

- **ユーザーへの確認は行わない**: 一貫して自律的に推論・実行を継続すること。
- **Bunを常に使用**: パッケージ管理、実行、テストすべてにおいて Bun を標準とする。
- **カバレッジ遵守**: カバレッジテストを含め、品質基準を下回る場合は完了とみなさない。
