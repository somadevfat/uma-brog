# 出力パターン (Output Patterns)

スキルが一貫した高品質の出力を生成する必要がある場合は、これらのパターンを使用してください。

## テンプレートパターン (Template Pattern)

出力形式のテンプレートを提供します。厳密さのレベルをニーズに合わせて調整してください。

**厳格な要件（APIレスポンスやデータ形式など）の場合：**

```markdown
## レポート構造

常に以下の正確なテンプレート構造を使用してください：

# [分析タイトル]

## エグゼクティブサマリー

[主要な発見事項の1段落の概要]

## 主要な発見事項

- 発見事項 1 (裏付けデータ付き)
- 発見事項 2 (裏付けデータ付き)
- 発見事項 3 (裏付けデータ付き)

## 推奨事項

1. 具体的な実行可能な推奨事項
2. 具体的な実行可能な推奨事項
```

**柔軟なガイダンス（適応が有用な場合）の場合：**

```markdown
## レポート構造

以下は適切なデフォルトの形式ですが、最善の判断を下してください：

# [分析タイトル]

## エグゼクティブサマリー

[概要]

## 主要な発見事項

[発見した内容に基づいてセクションを調整してください]

## 推奨事項

[特定のコンテキストに合わせて調整してください]

特定の分析タイプに合わせて、必要に応じてセクションを調整してください。
```

## 例示パターン (Examples Pattern)

出力の品質が例を見ることに依存するスキルの場合は、入力と出力のペアを提供します：

```markdown
## コミットメッセージの形式

以下の例に従ってコミットメッセージを生成してください：

**例 1:**
入力: Added user authentication with JWT tokens
出力:
```

feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware

```

**例 2:**
入力: Fixed bug where dates displayed incorrectly in reports
出力:
```

fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation

```

以下のスタイルに従ってください： type(scope): brief description, then detailed explanation.
```

例を提供することで、説明だけの場合よりも、Claudeが望ましいスタイルと詳細レベルをより明確に理解できるようになります。
