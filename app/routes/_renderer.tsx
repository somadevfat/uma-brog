import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { Nav } from '../../src/components/nav'

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Technical Archive and Portfolio Blog of uma-brog" />
        <title>UMA-BROG // SYSTEM ARCHIVE</title>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        <div class="bg-grid" />
        <div class="scanline" />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
})
