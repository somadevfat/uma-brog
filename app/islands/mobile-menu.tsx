import { useCallback, useEffect, useState } from 'hono/jsx'

/**
 * ナビゲーションリンクの型定義。
 */
interface NavLink {
  /** リンク先URL */
  href: string
  /** リンクラベル */
  label: string
}

/**
 * MobileMenu コンポーネントのプロパティ。
 */
interface MobileMenuProps {
  /** ナビゲーションリンクの配列 */
  links: NavLink[]
  /** 現在のページパス（アクティブ判定に使用） */
  currentPath: string
}

/**
 * モバイル向けハンバーガーメニュー Island コンポーネント。
 * 画面幅 600px 以下で表示され、ナビリンクをオーバーレイで提供する。
 * - ESCキーで閉じる
 * - オーバーレイ背景クリックで閉じる
 * - メニュー展開時に body スクロールをロック
 * @param {MobileMenuProps} props - コンポーネントのプロパティ。
 * @returns {JSX.Element} ハンバーガーメニュー。
 */
export default function MobileMenu({ links, currentPath }: MobileMenuProps) {
  // メニューの開閉状態
  const [isOpen, setIsOpen] = useState(false)

  /**
   * メニューを閉じるコールバック。
   */
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * メニューの開閉をトグルするコールバック。
   */
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // メニュー展開時のスクロールロックとESCキー対応
  useEffect(() => {
    if (isOpen) {
      // body のスクロールをロック
      document.body.style.overflow = 'hidden'

      // ESCキーでメニューを閉じる
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu()
        }
      }
      document.addEventListener('keydown', handleEsc)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEsc)
      }
    }
    // メニューが閉じた場合のクリーンアップ
    document.body.style.overflow = ''
  }, [isOpen, closeMenu])

  /**
   * リンクがアクティブかどうかを判定する。
   * @param {string} href - 判定対象のリンクURL。
   * @returns {boolean} アクティブかどうか。
   */
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath === href || currentPath.startsWith(href)
  }

  return (
    <div class="mobile-menu-wrapper">
      {/* ハンバーガーボタン */}
      <button
        type="button"
        class="hamburger-btn"
        onClick={toggleMenu}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-overlay"
      >
        <span class={`hamburger-icon ${isOpen ? 'is-open' : ''}`}>
          <span class="hamburger-line" />
          <span class="hamburger-line" />
          <span class="hamburger-line" />
        </span>
      </button>

      {/* オーバーレイメニュー */}
      {isOpen && (
        <div id="mobile-nav-overlay" class="mobile-nav-overlay">
          {/* オーバーレイ背景（クリックで閉じる） */}
          <button
            type="button"
            class="mobile-nav-backdrop"
            onClick={closeMenu}
            aria-label="メニューを閉じる"
            tabIndex={-1}
          />
          <nav class="mobile-nav-panel" aria-label="モバイルナビゲーション">
            {/* ナビゲーションリンク */}
            <ul class="mobile-nav-links">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    class={`mobile-nav-link ${isActive(link.href) ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
