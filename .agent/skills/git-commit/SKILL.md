---
name: git-commit
description: "プロジェクトのコミット規約に従ってGitコミットメッセージを作成し、コミットを実行するためのスキル。コミットメッセージは英語で記述し、`category: message` の形式を使用します。"
---

# Git Commit スキル

このスキルは、プロジェクトの標準的なコミット規約に従って、一貫性のあるコミットメッセージを作成し、Gitコミットを実行するためのガイドラインを提供します。

## コミット規約

すべてのコミットメッセージは以下のルールに従う必要があります：

1.  **言語**: コミットメッセージの本文は**英語**で記述してください。
2.  **形式**: `category: description` の形式を使用してください。
3.  **内容**: 簡潔かつ明瞭に変更内容を説明してください。

### コミットカテゴリ

以下の一般的なカテゴリから最適なものを選択してください：

-   `feat`: 新機能の追加
-   `fix`: バグ修正
-   `docs`: ドキュメントのみの変更
-   `style`: コードの意味に影響を与えない変更（ホワイトスペース、フォーマット、セミコロンの欠落など）
-   `refactor`: バグ修正や機能追加ではないコードの変更
-   `perf`: パフォーマンスを向上させるコードの変更
-   `test`: 不足しているテストの追加または既存のテストの修正
-   `build`: ビルドシステムや外部依存関係に影響を与える変更（npm, bunなど）
-   `ci`: CI設定ファイルやスクリプトの変更
-   `chore`: ソースコードやテストファイルを変更しないその他の変更
-   `revert`: 以前のコミットを元に戻す

## ワークフロー

1.  **変更内容の確認**: `git status` や `git diff --staged` を使用して、コミットする変更内容を正確に把握します。
2.  **カテゴリの選択**: 上記のリストから変更内容に最も適したカテゴリを選択します。
3.  **メッセージの作成**: 英語で簡潔な説明を記述します。
    -   例: `feat: add user authentication skill`
    -   例: `fix: resolve memory leak in data processing`
4.  **コミットの実行**: `git commit -m "category: description"` を実行します。

## 使用例

### 新機能を追加した場合
`git commit -m "feat: implement daily report generation"`

### バグを修正した場合
`git commit -m "fix: correct syntax error in database migration"`

### リファクタリングを行った場合
`git commit -m "refactor: simplify component hierarchy"`
