import { jsxRenderer } from 'hono/jsx-renderer'
import { HtmlShell } from '../../src/components/layout/html-shell'
import { MainLayout } from '../../src/components/layout/main-layout'

export default jsxRenderer(({ children, ...props }, c) => {
  const { title, description } = props as { title?: string; description?: string }
  return (
    <HtmlShell title={title} description={description}>
      <MainLayout path={c.req.path}>{children}</MainLayout>
    </HtmlShell>
  )
})
