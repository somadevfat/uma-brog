import type { Child } from 'hono/jsx'
import ThemeToggle from '../../../app/islands/theme-toggle'
import { Nav } from '../nav'

/**
 * メインレイアウトのプロパティ定義。
 */
interface MainLayoutProps {
  /** 子コンポーネント */
  children: Child
  /** 現在のURIパス */
  path: string
}

/**
 * アプリケーションの基本レイアウトコンポーネント。
 * ナビゲーションとメインコンテンツエリアを配置します。
 * @param {MainLayoutProps} props - コンポーネントのプロパティ。
 * @returns {JSX.Element} メインレイアウト。
 */
export const MainLayout = ({ children, path }: MainLayoutProps) => {
  return (
    <>
      {/* 共通ナビゲーション（テーマトグルをアクションとして渡す） */}
      <Nav path={path} headerActions={<ThemeToggle />} />
      {/* メインコンテンツエリア */}
      <main class="container">{children}</main>
    </>
  )
}
