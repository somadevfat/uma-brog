import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { Nav } from '../../src/components/nav'

export default jsxRenderer(({ children }, c) => {
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
        <div class="scanline" />
        <Nav path={c.req.path} />
        <main class="container">{children}</main>
        
        <div class="floating-star">
          <svg viewBox="0 0 50 50" fill="#666">
            <path d="M25 0 L28 22 L50 25 L28 28 L25 50 L22 28 L0 25 L22 22 Z" />
          </svg>
        </div>
      </body>
    </html>
  )
})
