import { jsxRenderer } from 'hono/jsx-renderer'
import { HtmlShell } from '../../src/components/layout/html-shell'
import { MainLayout } from '../../src/components/layout/main-layout'

/**
 * アプリケーションのグローバルレンダラー。
 * 共通の HTML シェルとメインレイアウトを適用します。
 */
export default jsxRenderer(({ children, ...props }, c) => {
  // プロパティからタイトルと説明を取得
  const { title, description } = props as { title?: string; description?: string }

  // HTMLシェルでラップしてレンダリング
  return (
    <HtmlShell title={title} description={description}>
      <MainLayout path={c.req.path}>{children}</MainLayout>
    </HtmlShell>
  )
})
