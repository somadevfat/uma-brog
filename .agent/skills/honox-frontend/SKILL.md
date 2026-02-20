---
name: honox-frontend
description: HonoX, Hono JSX, Islandsアーキテクチャを用いた高速なフロントエンド開発スキル。
---

# HonoX-Frontend スキル

このスキルは、HonoXの特徴である「Islands Architecture」と「Hono JSX」を最大限に活用し、パフォーマンスとUXを両立させるフロントエンド開発のためのガイドです。

## 1. ディレクトリ構成

HonoXの標準的な構成に従いつつ、Vanilla CSSによるデザインシステムを構築します。

```text
src/
├── app/                  # ルーティング (SSRページ)
├── components/           # デザイントークン、共有UI部品 (SSRのみ)
├── islands/              # インタラクティブな部品 (クライアントサイドJS)
├── mdx/                  # ブログ記事等のコンテンツ
└── style.css             # Vanilla CSS によるデザインシステム
```

## 2. ベストプラクティス

### 2.1. Islands Architecture の活用

- デフォルトですべてをサーバーサイドでレンダリングする。
- `useState`, `useEffect` などの動的機能が必要な部品だけを `islands/` に配置する。
- Islandは小さければ小さいほど良い（Lighthouseスコアに直結）。

### 2.2. Vanilla CSS によるデザインシステム

- `index.css` に CSS Variables を定義し、グローバルなデザイントークンを管理。
- `@layer` を使用してスタイルの優先順位を整理。
- **リッチなAesthetics**: グラデーション、グラスモーフィズム、Subtle Animations をCSS標準機能で実装。

```css
:root {
  --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}
```

### 2.3. Hono JSX + MDX

- 記事本文はMDXで記述。
- MDX内でカスタムコンポーネント（Islands）を使用することで、リッチな体験（インタラクティブな図解など）を提供。

## 3. パフォーマンス最適化

- **Bundle Size**: 重い外部ライブラリを避け、ブラウザ標準APIを活用。
- **Streaming**: Honoの `c.streamText()` や `stream` 機能を検討し、大きなコンテンツの高速表示を狙う。

## 4. 参照

- [HonoX Documentation](https://github.com/honojs/honox)
- [MDX Documentation](https://mdxjs.com/)
- [Modern CSS Patterns](https://web.dev/learn/css/)
