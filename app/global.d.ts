import type { Child } from 'hono/jsx'
import { DrizzleDB } from '../src/db/client'

declare module 'hono' {
  interface ContextRenderer {
    (
      children: Child,
      props?: { title?: string; description?: string }
    ): Response | Promise<Response>
  }
  interface Env {
    Variables: {
      db: DrizzleDB
    }
    Bindings: {
      DB: D1Database
    }
  }
}
