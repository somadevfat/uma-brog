import { useEffect, useState } from 'hono/jsx'

/**
 * テーマ（ライト/ダーク）切り替えトグルコンポーネント。
 * クライアントサイドでのみ動作し、localStorage と ドキュメントの要素属性を更新します。
 * @returns {JSX.Element} テーマ切り替えボタン
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  // 初期化時に保存されたテーマを読み込む
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // 保存されていない場合はシステム設定に基づき適用
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(isDarkMode ? 'dark' : 'light', true)
    }
  }, [])

  // テーマを DOM に適用する関数
  const applyTheme = (newTheme: 'light' | 'dark', isSystemFallback = false) => {
    // <html> 要素の属性を利用して CSS 側で状態を上書きできるように設定
    document.documentElement.setAttribute('data-theme', newTheme)

    // システムフォールバックでなければ localStorage に保存
    if (!isSystemFallback) {
      localStorage.setItem('theme-preference', newTheme)
    }
  }

  // トグルクリック時の処理
  const toggleTheme = () => {
    let newTheme: 'light' | 'dark'

    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      newTheme = isDarkMode ? 'light' : 'dark' // 現在の設定と逆にする
    } else {
      newTheme = theme === 'dark' ? 'light' : 'dark'
    }

    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="theme-toggle"
      aria-label="Toggle theme"
      title="Toggle Light/Dark Mode"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <title>Theme Toggle Icon</title>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </button>
  )
}
