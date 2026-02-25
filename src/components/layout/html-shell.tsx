import { raw } from 'hono/html'
import type { Child } from 'hono/jsx'
import { Link, Script } from 'honox/server'

/**
 * HTML シェルのプロパティ定義。
 */
interface HtmlShellProps {
  /** 子コンポーネント */
  children: Child
  /** ページタイトル */
  title?: string
  /** ページの説明文（meta description） */
  description?: string
  /** 現在のパス（未使用だが型定義に含まれる） */
  path: string
}

/**
 * ページ読み込み時のテーマちらつき (FOUC) を防止するインラインスクリプト。
 * CSS・JSの評価前に実行され、data-theme 属性を即座にセットする。
 */
const themeInitScript = raw(`<script>
(function(){
  var t = localStorage.getItem('theme-preference');
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-theme', t);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
</script>`)

/**
 * アプリケーション全体の HTML 基本構造を定義するコンポーネント。
 * meta タグ、CSS、クライアントサイドスクリプトの読み込み、および装飾要素を管理します。
 * @param {Omit<HtmlShellProps, 'path'>} props - コンポーネントのプロパティ。
 * @returns {JSX.Element} HTML シェル。
 */
export const HtmlShell = ({ children, title, description }: Omit<HtmlShellProps, 'path'>) => {
  // ページタイトルをフォーマット
  const displayTitle = title ? `${title} // SOMA-DEVLOG` : 'SOMA-DEVLOG // SYSTEM ARCHIVE'
  // 説明文を決定
  const displayDescription = description || 'Technical Archive and Portfolio Blog of SOMA-DEVLOG'

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={displayDescription} />
        <title>{displayTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* テーマ初期化スクリプト（FOUC防止: CSSより前に実行） */}
        {themeInitScript}
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        {/* レトロフューチャーな走査線エフェクト（ダークモード時のみ表示） */}
        <div class="scanline" />
        {children}

        {/* 装飾用の浮遊する星形アイコン */}
        <div class="floating-star">
          <svg viewBox="0 0 50 50" fill="#666" aria-hidden="true">
            <path d="M25 0 L28 22 L50 25 L28 28 L25 50 L22 28 L0 25 L22 22 Z" />
          </svg>
        </div>
      </body>
    </html>
  )
}
