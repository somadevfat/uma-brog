import { DrizzleDB } from '../src/db/client'

declare module 'hono' {
  interface Env {
    Variables: {
      db: DrizzleDB
    }
    Bindings: {
      DB: D1Database
    }
  }
}
