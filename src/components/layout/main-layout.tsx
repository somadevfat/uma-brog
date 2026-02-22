import type { Child } from 'hono/jsx'
import { Nav } from '../nav'

interface MainLayoutProps {
  children: Child
  path: string
}

export const MainLayout = ({ children, path }: MainLayoutProps) => {
  return (
    <>
      <Nav path={path} />
      <main class="container">{children}</main>
    </>
  )
}
