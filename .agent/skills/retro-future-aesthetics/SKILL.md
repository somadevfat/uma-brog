---
name: retro-future-aesthetics
description: イメージ画に基づく「レトロフューチャー・宇宙工学・精密線画」のデザイン美学をコードで表現するためのスキル。
---

# Retro-Future Aesthetics スキル

このスキルは、提供されたイメージ画（UMA-BLOG）および `design/coror.md` に基づき、冷徹で緻密な、機密アーカイブのような世界観をフロントエンドで完璧に再現するためのガイドです。

## 1. デザインの本質 (Vision from Image)

- **イメージ画の再現**: 漆黒の背景、極細の白い格子、そしてアクセントとしての赤。
- **テクスチャ**: 物理的な紙やスクリーンではなく、ベクターデータの設計図が空中（またはダークモニター）に浮かんでいるような質感。
- **精密性**: すべての線は `1px` であり、ボケや曖昧さを許さない。

## 2. 実装の掟 (The Laws of Code)

### 2.1. 背景とグリッド (The Canvas)

- **Base Background**: `#0A0A0A` (完全な黒ではなく、奥行きを感じる極上の黒)
- **Grid Layer**: 20px〜40px角の精密な方眼グリッド。固定ではなく、スクロールしても追従、または絶妙に配置される。

```css
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### 2.2. ボーダーと線 (The Blueprints)

- **Strict 1px**: 枠線、区切り線はすべて `1px solid rgba(255, 255, 255, 0.2)`。
- **No Border Radius**: 角丸は `0px`。工業的・数学的な正確さを優先。
- **Accented Lines**: 重要なセクションの見出し下など、特定の場所のみ `Accent Red (#E60012)` の細線を引く。

### 2.3. インタラクションと発光 (The Signals)

- **Accent Red (#E60012)**: ホバー時やクリック時、重要な通知のみに限定して使用。
- **Glow Effect (Subtle)**: 赤い要素には、かすかな外光（`box-shadow: 0 0 8px #E60012`）を与え、モニター上の警告灯のような質感を出す。
- **Scanline Effect (Optional)**: 画面全体に極めて薄い横方向の走査線ノイズを入れ、アーカイブ・ターミナルの雰囲気を強調。

### 2.4. タイポグラフィ (The Data)

- **Main Font**: `Inter` または `Roboto Mono`。細いウェイト (100 or 300) を使用。
- **Letter Spacing**: `0.1em` 以上の広めの字間。冷徹さと情報の重みを演出。
- **Uppercase**: 見出しやラベルは基本的に大文字。

## 3. コンポーネントの構築指針

### 3.1. カード (Blueprint Cards)

- 背景は透過または極薄いグレー。
- ホバー時に境界線が白から赤へ滑らかに変化する。

### 3.2. 演出 (Micro-interactions)

- **Line Animation**: ページ遷移時やセクション表示時に、境界線が中央から外側に伸びるようなアニメーション。
- **Typing Effect**: 見出しテキストは、一文字ずつ表示されるタイピングエフェクトを推奨。

## 4. 厳格な回避事項 (Common Pitfalls)

- ❌ グラデーション（Primary Redを除く）の使用。
- ❌ 太いボーダー（2px以上）。
- ❌ 鮮やかな青や緑などの不要な色。
- ❌ 柔らかいシャドウ、大きな角丸。

---

本スキルは、イメージ画が示す「静謐な緊張感」をコードによって具現化するための絶対的な基準である。
