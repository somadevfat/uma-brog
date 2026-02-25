import { useEffect, useState } from 'hono/jsx'

/** テーマの型定義 */
type Theme = 'light' | 'dark'

/** localStorage のキー */
const STORAGE_KEY = 'theme-preference'

/**
 * 現在の有効テーマを取得する。
 * localStorage に保存されていればそれを使い、なければシステム設定を参照する。
 * @returns {Theme} 現在のテーマ
 */
const getEffectiveTheme = (): Theme => {
  // localStorage から保存済み設定を取得
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'light' || saved === 'dark') {
    return saved
  }

  // システムのカラースキーム設定をフォールバックとして使用
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * テーマを DOM に適用する。
 * html 要素の data-theme 属性を更新する。
 * @param {Theme} theme - 適用するテーマ
 */
const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * テーマ（ライト/ダーク）切り替えトグルコンポーネント。
 * クライアントサイドの Island として動作し、localStorage に設定を永続化する。
 * @returns {JSX.Element} テーマ切り替えボタン
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  // 初回マウント時にテーマを検出して適用
  useEffect(() => {
    const effective = getEffectiveTheme()
    setTheme(effective)
    applyTheme(effective)
  }, [])

  // テーマ切り替えハンドラ
  const handleToggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      class="theme-toggle"
      aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      {/* 月アイコン（ライトモード時に表示 → クリックでダークへ） */}
      <svg
        class="icon-moon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <title>ダークモードに切り替え</title>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* 太陽アイコン（ダークモード時に表示 → クリックでライトへ） */}
      <svg
        class="icon-sun"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <title>ライトモードに切り替え</title>
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
