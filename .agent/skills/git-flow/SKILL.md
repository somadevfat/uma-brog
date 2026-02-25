---
name: git-flow
description: プロジェクトのGitブランチ戦略を管理するためのスキル。main（安定版）、dev（開発ベース）、feature/*（機能開発）のブランチ運用を定義し、新しい機能の開発開始、リリースの準備、ブランチの同期などの手順を提供します。
---

# Git Flow スキル

このスキルは、プロジェクトの標準的なブランチ戦略（Git Flow）に従って、効率的かつ安全に開発を進めるためのガイドラインを提供します。

## ブランチの役割

| ブランチ名 | 役割 | 説明 |
| :--- | :--- | :--- |
| `main` | 安定版 / 本番用 | 常にデプロイ可能な、最も安定したコード。 |
| `dev` | 開発ベース | 次のリリースに向けた開発の統合先ブランチ。 |
| `feature/*` | 機能開発 | 個別の機能追加やバグ修正を行うための短期間のブランチ。 |

## 基本ルール

1.  **`feature/` ブランチは必ず `dev` から作成する。**
2.  開発が完了した `feature/` ブランチは `dev` にマージする。
3.  `dev` の内容が十分に検証された後、`main` にマージしてリリースする。
4.  `main` への直接のコミットは原則禁止。

## ワークフロー

### 1. 新しい機能の開発を開始する
1.  `dev` ブランチを最新の状態にする: `git checkout dev && git pull origin dev`
2.  `dev` から新しい `feature/` ブランチを作成する: `git checkout -b feature/your-feature-name`

### 2. 機能開発を完了し、統合する
1.  `feature/` ブランチでの開発とテストを完了させる。
2.  `dev` ブランチに切り替える: `git checkout dev`
3.  `dev` を最新にする: `git pull origin dev`
4.  `feature/` ブランチをマージする: `git merge feature/your-feature-name`
5.  マージした `dev` をプッシュする: `git push origin dev`
6.  （オプション）不要になったブランチを削除する: `git branch -d feature/your-feature-name`

### 3. リリースを準備する（`dev` から `main`）
1.  `main` ブランチを最新にする: `git checkout main && git pull origin main`
2.  `dev` ブランチを `main` にマージする: `git merge dev`
3.  `main` をプッシュする: `git push origin main`
4.  必要に応じてリリースタグを作成する: `git tag -a v1.0.0 -m "release version 1.0.0" && git push origin v1.0.0`
5.  `dev` に `main` をマージして同期させる（マージコミットなどが発生した場合）: `git checkout dev && git merge main && git push origin dev`

## 注意事項

- コンフリクトが発生した場合は、速やかに解決し、再度テストを実行してください。
- リリース準備の際は、`main` にマージする前に必ず `dev` で最終的なビルドとテストの確認を行ってください。
