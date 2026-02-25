import { jsxRenderer } from 'hono/jsx-renderer'
import { HtmlShell } from '../../src/components/layout/html-shell'
import MobileMenu from '../islands/mobile-menu'
import ThemeToggle from '../islands/theme-toggle'

/**
 * アプリケーションのグローバルレンダラー。
 * 共通の HTML シェルとメインレイアウトを適用します。
 * Island コンポーネント（ThemeToggle, MobileMenu）はルートファイルから直接インポートし、
 * children のフロー内で使用することでハイドレーションを確実にする。
 */
export default jsxRenderer(({ children, ...props }, c) => {
  // プロパティからタイトルと説明を取得
  const { title, description } = props as { title?: string; description?: string }

  // ナビゲーションリンクの定義
  const links = [
    { href: '/', label: 'About' },
    { href: '/portfolio', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  // 現在のパス
  const path = c.req.path

  // HTMLシェルでラップしてレンダリング
  return (
    <HtmlShell title={title} description={description}>
      {/* ヘッダーナビゲーション */}
      <header class="site-header container">
        <a href="/" class="logo">
          SOMA-DEVLOG
        </a>
        {/* デスクトップナビゲーション（600px超で表示） */}
        <nav class="main-nav">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class={
                path === link.href || (link.href !== '/' && path?.startsWith(link.href))
                  ? 'active'
                  : ''
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* テーマトグル + モバイルメニュー Island */}
        <div class="header-actions">
          <ThemeToggle />
          {/* モバイル専用ハンバーガーメニュー（600px以下で表示） */}
          <MobileMenu links={links} currentPath={path} />
        </div>
      </header>
      {/* メインコンテンツ */}
      <main class="container">{children}</main>
    </HtmlShell>
  )
})
