/**
 * メインナビゲーションコンポーネント。
 * アプリケーションのグローバルヘッダーとメニューを提供します。
 * テーマトグルボタンのスロットを含みます。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {string} [props.path] - 現在のURIパス（アクティブ状態の判定に使用）。
 * @param {import('hono/jsx').Child} [props.headerActions] - ヘッダー右端に配置するアクション要素。
 * @returns {JSX.Element} ナビゲーションヘッダー。
 */
export const Nav = ({
  path,
  headerActions,
}: {
  path?: string
  headerActions?: import('hono/jsx').Child
}) => {
  // ナビゲーションリンクの定義
  const links = [
    { href: '/', label: 'About' },
    { href: '/portfolio', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header class="site-header container">
      {/* サイトロゴとホームリンク */}
      <a href="/" class="logo">
        SOMA-DEVLOG
      </a>

      {/* ナビゲーションリンク群 */}
      <nav class="main-nav">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            // 現在のパスに基づいてアクティブクラスを割り当て
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

      {/* ヘッダー右端のアクションエリア */}
      <div class="header-actions">
        {headerActions}
        {/* 検索アイコン（装飾用） */}
        <div class="search-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <title>Search</title>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </header>
  )
}
