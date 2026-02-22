import type { Child } from 'hono/jsx'
import { Link, Script } from 'honox/server'

interface HtmlShellProps {
  children: Child
  title?: string
  description?: string
  path: string
}

export const HtmlShell = ({ children, title, description }: Omit<HtmlShellProps, 'path'>) => {
  const displayTitle = title ? `${title} // UMA-BROG` : 'UMA-BROG // SYSTEM ARCHIVE'
  const displayDescription = description || 'Technical Archive and Portfolio Blog of uma-brog'

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={displayDescription} />
        <title>{displayTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        <div class="scanline" />
        {children}

        <div class="floating-star">
          <svg viewBox="0 0 50 50" fill="#666" aria-hidden="true">
            <path d="M25 0 L28 22 L50 25 L28 28 L25 50 L22 28 L0 25 L22 22 Z" />
          </svg>
        </div>
      </body>
    </html>
  )
}
